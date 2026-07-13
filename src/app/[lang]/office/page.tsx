import styles from '@/styles/Office.module.css'
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

function renderBold(text: string, phrase: string) {
  const idx = text.indexOf(phrase)
  if (idx === -1) return <>{text}</>
  return <>{text.slice(0, idx)}<strong>{phrase}</strong>{text.slice(idx + phrase.length)}</>
}

export default async function OfficePage() {
  const t = await getTranslations('office')
  const bimPhrase = t('bimBoldPhrase')
  const calcPhrase = t('calcBoldPhrase')

  const servicios = [
    {
      intro: t('proyectamosIntro'),
      items: [
        t('proyectamosItem1'),
        t('proyectamosItem2'),
        t('proyectamosItem3'),
        t('proyectamosItem4'),
      ]
    },
    {
      intro: t('dirigimosIntro'),
      items: [
        t('dirigimosItem1'),
        t('dirigimosItem2'),
      ]
    },
    {
      intro: t('construimosIntro'),
      items: [
        t('construimosItem1'),
        t('construimosItem2'),
        t('construimosItem3'),
      ]
    },
    {
      intro: t('asesoramosIntro'),
      items: [
        t('asesoramosItem1'),
        t('asesoramosItem2'),
      ]
    }
  ]

  return (
    <section className={styles.officeSection}>

      <div className={styles.block}>
        <h2 className={`fontUnageoRegularBold fs36 ${styles.blockTitle}`}>
          {t('whoWeAreTitle')}
        </h2>
        <div className={styles.textContent}>
          {t('whoWeAreText').split('\n').map((paragraph, i) => (
            <p key={i} className={`fontUnageoRegular fs18 ${styles.paragraph}`}>
              {paragraph.includes(bimPhrase)
                ? renderBold(paragraph, bimPhrase)
                : paragraph.includes(calcPhrase)
                  ? renderBold(paragraph, calcPhrase)
                  : paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <h2 className={`fontUnageoRegularBold fs36 ${styles.blockTitle}`}>
          {t('whatWeDoTitle')}
        </h2>
        {servicios.map((seccion, idx) => (
          <div key={idx} className={styles.serviceSection}>
            <p className={`fontUnageoRegular fs18 ${styles.paragraph}`}>
              {seccion.intro}
            </p>
            <ul className={styles.serviceGrid}>
              {seccion.items.map((item, i) => (
                <li key={i} className={`fontUnageoRegular fs16 ${styles.serviceItem}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </section>
  )
}
