'use client'

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
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface FormValues {
  nombre: string
  email: string
  mensaje: string
}

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const isMobileClient = useMediaQuery('(max-width: 768px)')
  const [isMobile, setIsMobile] = useState(true)
  const t = useTranslations('contact')

  useEffect(() => {
    setIsMobile(isMobileClient)
  }, [isMobileClient])

  const form = useForm<FormValues>({
    initialValues: {
      nombre: '',
      email: '',
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
      console.log(form.values)
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder={t('namePlaceholder')}
                className={`${styles.input} fs24`}
                classNames={{ input: styles.formInput }}
                {...form.getInputProps('nombre')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder={t('emailPlaceholder')}
                className={`${styles.input} fs24`}
                classNames={{ input: styles.formInput }}
                {...form.getInputProps('email')}
              />
            </Grid.Col>
          </Grid>
          <div style={{ marginTop: isMobile ? '0px' : '60px' }}>
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
      <div style={{ marginTop: '60px' }}>
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
