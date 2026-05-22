'use client'
import styles from '@/styles/Header.module.css'
import { Burger } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import LanguageSwitcher from '@/contexts/LanguageSwitcher'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const t = useTranslations('nav')
  const [isDark, setIsDark] = useState(true)
  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const locale = useLocale()
  const pathname = usePathname()
  const isHomePage = pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`

  const toggleBurger = () => {
    setOpened((o) => !o)
  }

  return (
    <header className={`${styles.header} ${isDark ? styles.dark : styles.light}`}>
      {isMobile && (<Link href={`/${locale}`} className={styles.logo}>
        CASAGRANDE<br />INGENIERIA
      </Link>)}
      {!isMobile && !isHomePage && (<Link href={`/${locale}`} >
        <Image
          src="/logo.svg"
          alt="Logo"
          className={styles.image}
          priority
          width={170}
          height={60}
          unoptimized
        />
      </Link>)}
      {!isMobile && isHomePage && (<div />)}
      {isMobile && (
        <Burger
          opened={opened}
          onClick={toggleBurger}
          className={styles.burger}
        />
      )}
      <nav className={`${styles.nav} ${opened ? styles.opened : ''}`}>
        <Link href={`/${locale}/projects`} onClick={() => setOpened(false)} style={pathname.includes('/projects') ? { color: '#9A9A9A' } : {}}>{t('projects')}</Link>
        <Link href={`/${locale}/office`} onClick={() => setOpened(false)} style={pathname.includes('/office') ? { color: '#9A9A9A' } : {}}>{t('office')}</Link>
        <Link href={`/${locale}/contact`} onClick={() => setOpened(false)} style={pathname.includes('/contact') ? { color: '#9A9A9A' } : {}}>{t('contact')}</Link>
        <div className={styles.langMobile}><LanguageSwitcher /></div>
      </nav>
      <div className={styles.langDesktop}><LanguageSwitcher /></div>
    </header>
  )
}