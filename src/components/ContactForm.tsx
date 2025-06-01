'use client'

import styles from '@/styles/ContactForm.module.css'
import {
  Button,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconSend } from '@tabler/icons-react'
import { useState } from 'react'

interface FormValues {
  nombre: string
  apellido: string
  telefono: string
  email: string
  mensaje: string
}

export function ContactForm() {
  const [loading, setLoading] = useState(false)


  const form = useForm<FormValues>({
    initialValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      mensaje: ''
    },
    validate: {
      nombre: (value) => value.trim().length < 1 ? 'El nombre es obligatorio' : null,
      apellido: (value) => value.trim().length < 1 ? 'El apellido es obligatorio' : null,
      telefono: (value) => /^\d{9,15}$/.test(value) ? null : 'Ingrese un número de teléfono válido',
      email: (value) => /^\S+@\S+\.\S+$/.test(value) ? null : 'Ingrese un email válido',
      mensaje: (value) => value.trim().length < 5 ? 'El mensaje debe tener al menos 10 caracteres' : null,
    },
  })


  const handleSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Aquí iría la lógica para enviar el formulario
      console.log(values)

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000))

      notifications.show({
        title: 'Formulario enviado',
        message: 'Nos pondremos en contacto contigo pronto',
        color: 'green',
      })

      form.reset()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo enviar el formulario. Inténtalo de nuevo.',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id='contact' className={styles.contactForm}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        className={styles.formContainer}
      >
        <Title order={2} className={styles.title}>Contáctanos</Title>
        <Text c="dimmed" size="sm" className={styles.subtitle}>
          Completa el formulario y nos pondremos en contacto contigo a la brevedad
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* First row: Nombre y Apellido */}
          <div className={`${styles.inputRow} ${styles.nameSection}`}>
            <div className={styles.inputField}>
              <TextInput
                label="Nombre"
                placeholder="Tu nombre"
                required
                {...form.getInputProps('nombre')}
              />
            </div>
            <div className={styles.inputField}>
              <TextInput
                label="Apellido"
                placeholder="Tu apellido"
                required
                {...form.getInputProps('apellido')}
              />
            </div>
          </div>

          {/* Second row: Teléfono y Email */}
          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <TextInput
                label="Teléfono"
                placeholder="Tu número de teléfono"
                required
                {...form.getInputProps('telefono')}
              />
            </div>
            <div className={styles.inputField}>
              <TextInput
                label="Email"
                placeholder="tu@email.com"
                required
                {...form.getInputProps('email')}
              />
            </div>
          </div>

          {/* Mensaje */}
          <div className={styles.inputField}>
            <Textarea
              label="Mensaje"
              placeholder="¿En qué podemos ayudarte?"
              minRows={4}
              required
              {...form.getInputProps('mensaje')}
            />
          </div>

          <div className={styles.submitButton}>
            <Button
              type="submit"
              size="md"
              loading={loading}
              leftSection={<IconSend size="1rem" />}
            >
              Enviar mensaje
            </Button>
          </div>
        </form>
      </Paper>
    </section>
  )
}