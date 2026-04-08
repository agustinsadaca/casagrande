import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com').replace(/\/$/, '')

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params
  const isEs = lang === 'es'

  return {
    title: isEs ? 'Oficina' : 'Office',
    description: isEs
      ? 'Conocé nuestra oficina. Desarrollamos soluciones estructurales integrando análisis técnico y experiencia constructiva para proyectos en Mendoza, Argentina.'
      : 'Learn about our office. We develop structural solutions integrating technical analysis and building expertise for projects in Mendoza, Argentina.',
    alternates: {
      canonical: `${siteUrl}/${lang}/office`,
      languages: {
        es: `${siteUrl}/es/office`,
        en: `${siteUrl}/en/office`,
      },
    },
  }
}

export default async function OfficePage() {
  const t = await getTranslations('office')

  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '0 11%' }}>
      <p className="fontUnageoRegularSemiBold fs24" style={{ textAlign: 'center' }}>
        {t('text')}
      </p>
    </section>
  )
}
