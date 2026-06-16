'use client'

import { useReCaptcha } from '@/app/ReCaptchaContext'
import styles from '@/styles/ContactForm.module.css'
import {
  Button,
  Grid,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface FormValues {
  nombre: string
  email: string
  empresa: string
  mensaje: string
}

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const t = useTranslations('contact')
  const { captchaToken } = useReCaptcha()

  const form = useForm<FormValues>({
    initialValues: {
      nombre: '',
      email: '',
      empresa: '',
      mensaje: ''
    },
    validate: {
      nombre: (value) =>
        value.trim().length < 1 ? t('validation.nameRequired') : null,
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : t('validation.emailInvalid'),
      mensaje: (value) =>
        value.trim().length < 5 ? t('validation.messageMinLength') : null
    }
  })

  const handleSubmit = async () => {
    const validation = form.validate()
    if (validation.hasErrors) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form.values, captchaToken }),
      })

      if (res.status === 400) {
        const data = await res.json()
        if (data.error === 'bot') {
          notifications.show({
            title: t('notifications.botDetectedTitle'),
            message: t('notifications.botDetectedMessage'),
            color: 'red'
          })
          return
        }
        throw new Error('bad request')
      }

      if (!res.ok) throw new Error('server error')

      notifications.show({
        title: t('notifications.successTitle'),
        message: t('notifications.successMessage'),
        color: 'green'
      })

      form.reset()
    } catch (error) {
      notifications.show({
        title: t('notifications.errorTitle'),
        message: t('notifications.errorMessage'),
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className={styles.contactForm}>
      <Title order={2} className={`fs36 ${styles.title}`}>
        {t('title')}
      </Title>
      <Grid gutter="xl" className={styles.grid}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Grid className={styles.grid}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder={t('namePlaceholder')}
                className={`${styles.input} fs24`}
                classNames={{ input: styles.formInput }}
                {...form.getInputProps('nombre')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder={t('emailPlaceholder')}
                className={`${styles.input} fs24`}
                classNames={{ input: styles.formInput }}
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder={t('companyPlaceholder')}
                className={`${styles.input} fs24`}
                classNames={{ input: styles.formInput }}
                {...form.getInputProps('empresa')}
              />
            </Grid.Col>
          </Grid>
          <div className={styles.textareaWrapper}>
            <Textarea
              placeholder={t('messagePlaceholder')}
              className={`${styles.input} fs24`}
              classNames={{ input: styles.formInput }}
              minRows={4}
              {...form.getInputProps('mensaje')}
            />
          </div>
        </Grid.Col>
        {/* Institutional text */}
        <Grid.Col span={{ base: 12, md: 4 }} className={styles.messageContainer}>
          <Text className={`fs21 c131313 ${styles.messageText}`}>
            {t('bodyText')}
            <br />
            <strong>{t('cta')}</strong>
          </Text>
        </Grid.Col>
      </Grid>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={handleSubmit}
          variant="default"
          loading={loading}
          size="xs"
          className={`fs21 ${styles.button}`}
        >
          {t('sendButton')}
        </Button>
      </div>
    </section>
  )
}
