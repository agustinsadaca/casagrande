'use client'
import styles from '@/styles/Header.module.css'
import { Burger } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const [isDark, setIsDark] = useState(true)
  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const locale = useLocale()
  const router = useRouter()

  const toggleBurger = () => {
    setOpened((o) => !o)
  }

  const handleNavClick = (sectionId, e) => {
    e.preventDefault()
    setOpened(false)

    const isHomePage = window.location.pathname === `/${locale}` ||
      window.location.pathname === `/${locale}/`

    if (isHomePage) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push(`/${locale}/#${sectionId}`)
    }
  }

  return (
    <header className={`${styles.header} ${isDark ? styles.dark : styles.light}`}>
      {isMobile ?
        <Link href="/" className={styles.logo}>
          CASAGRANDE<br />INGENIERIA
        </Link> : <div></div>
      }
      {isMobile && (
        <Burger
          opened={opened}
          onClick={toggleBurger}
          className={styles.burger}
        />
      )}
      <nav className={`${styles.nav} ${opened ? styles.opened : ''}`}>
        <a href={`#projects`} onClick={(e) => handleNavClick('projects', e)}>PROYECTOS</a>
        <a href={`#office`} onClick={(e) => handleNavClick('office', e)}>OFICINA</a>
        <a href={`#contact`} onClick={(e) => handleNavClick('contact', e)}>CONTACTO</a>
      </nav>
    </header>
  )
}