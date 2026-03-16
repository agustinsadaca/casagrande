'use client'

import styles from '@/styles/LanguageSwitcher.module.css'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

const labels: Record<string, string> = {
  es: 'ESPAÑOL',
  en: 'ENGLISH',
}

const nextLocaleMap: Record<string, string> = {
  es: 'en',
  en: 'es',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = () => {
    const next = nextLocaleMap[locale] ?? 'es'
    router.push(pathname.replace(`/${locale}`, `/${next}`))
    router.refresh()
  }

  const nextLocale = nextLocaleMap[locale] ?? 'es'

  return (
    <button
      className={styles.switcher}
      onClick={handleSwitch}
      aria-label={nextLocale === 'en' ? 'Switch to English' : 'Cambiar a Español'}
      title={nextLocale === 'en' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {labels[nextLocale]}
    </button>
  )
}
