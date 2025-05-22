'use client'
import styles from '@/styles/Header.module.css'
import { Burger } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isDark, setIsDark] = useState(true)
  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const locale = useLocale()

  const toggleBurger = () => {
    setOpened((o) => !o)
  }

  return (
    <header className={`${styles.header} ${isDark ? styles.dark : styles.light}`}>
      <Link href="/" className={styles.logo}>
        CASAGRANDE<br />INGENIERIA
      </Link>
      {isMobile && (
        <Burger
          opened={opened}
          onClick={toggleBurger}
          className={styles.burger}
        />
      )}
      <nav className={`${styles.nav} ${opened ? styles.opened : ''}`}>
        <a href={`/${locale}#projects`}>PROYECTOS</a>
        <a href={`/${locale}#office`}>OFICINA</a>
        <a href={`/${locale}#contact`}>CONTACTO</a>
      </nav>
    </header>
  )
}