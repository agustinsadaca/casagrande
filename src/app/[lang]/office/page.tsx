import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import styles from '@/styles/Office.module.css'

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

  const whatWeDoItems = [
    t('whatWeDoItem1'),
    t('whatWeDoItem2'),
    t('whatWeDoItem3'),
    t('whatWeDoItem4'),
  ]

  return (
    <section className={styles.officeSection}>

      <div className={styles.block}>
        <h2 className={`fontUnageoRegularBold fs36 ${styles.blockTitle}`}>
          {t('whoWeAreTitle')}
        </h2>
        <div className={styles.textContent}>
          {t('whoWeAreText').split('\n\n').map((paragraph, i) => (
            <p key={i} className={`fontUnageoRegular fs18 ${styles.paragraph}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <h2 className={`fontUnageoRegularBold fs36 ${styles.blockTitle}`}>
          {t('whatWeDoTitle')}
        </h2>
        <p className={`fontUnageoRegular fs18 ${styles.paragraph}`}>
          {t('whatWeDoIntro')}
        </p>
        <ul className={styles.serviceGrid}>
          {whatWeDoItems.map((item, i) => (
            <li key={i} className={`fontUnageoRegular fs16 ${styles.serviceItem}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}
