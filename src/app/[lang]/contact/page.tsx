import { ContactForm } from '@/components/ContactForm'
import { Metadata } from 'next'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com').replace(/\/$/, '')

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params
  const isEs = lang === 'es'

  return {
    title: isEs ? 'Contacto' : 'Contact',
    description: isEs
      ? 'Contactanos para comenzar tu proyecto de ingeniería estructural. En CASAGRANDE INGENIERIA nos involucramos desde el inicio del proyecto.'
      : 'Contact us to start your structural engineering project. At CASAGRANDE INGENIERIA we get involved from the very beginning.',
    alternates: {
      canonical: `${siteUrl}/${lang}/contact`,
      languages: {
        es: `${siteUrl}/es/contact`,
        en: `${siteUrl}/en/contact`,
      },
    },
  }
}

export default function ContactPage() {
  return <ContactForm />
}
