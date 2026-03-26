'use client'

import { useTranslations } from 'next-intl'

export default function OfficePage() {
  const t = useTranslations('office')

  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '0 11%' }}>
      <p className="fontUnageoRegularSemiBold fs24" style={{ textAlign: 'center' }}>
        {t('text')}
      </p>
    </section>
  )
}
