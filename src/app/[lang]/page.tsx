'use client'
import HeroImage from '@/components/Hero'
import ProjectDetails from '@/components/Projects'
import ArrowScrollUp from '../../components/ArrowScrollUp'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function Home() {
  const locale = useLocale()
  const t = useTranslations('projects')

  return (
    <>
      <HeroImage />
      <ProjectDetails limit={2} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 80px' }}>
        <Link
          href={`/${locale}/projects`}
          className="fontUnageoRegularSemiBold fs21"
          style={{ border: '1px solid black', borderRadius: 0, padding: '8px 32px' }}
        >
          {t('seeMore')}
        </Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
        <ArrowScrollUp />
      </div>
    </>
  )
}
