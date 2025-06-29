'use client'
import styles from '@/styles/Footer.module.css'
import { Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import IconsFooter from './IconsFooter'

export default function Footer() {
  const pathname = usePathname()
  const [isHomePage, setIsHomePage] = useState(false)
  const isMobileClient = useMediaQuery('(max-width: 768px)')
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(isMobileClient)
  }, [isMobileClient])

  useEffect(() => {
    const isHome = pathname === '/' || /^\/[a-z]{2}(\/)?$/.test(pathname)
    setIsHomePage(isHome)
  }, [pathname])

  const buttonStyles = {
    root: {
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',
      padding: 0,
      height: 'auto',
      '&:hover': {
        background: 'transparent'
      }
    }
  }

  const handleContactClick = useCallback((e) => {
    e.preventDefault()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      window.location.href = '/#contact'
    }
  }, [])

  return (
    <footer className={styles.footer} style={{ paddingLeft: isHomePage && !isMobile ? '180px' : 'auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
        gap: '1rem',
        padding: '10px 0'
      }}>
        <Button
          component="a"
          href="https://www.instagram.com/casagrande.ingenieria"
          target="_blank"
          rel="noopener noreferrer"
          variant="transparent"
          p={0}
          styles={buttonStyles}
        >
          <IconsFooter iconName="instagram" />
        </Button>

        <Button
          component="a"
          href="https://facebook.com/casagrande.ingenieria"
          target="_blank"
          rel="noopener noreferrer"
          variant="transparent"
          p={0}
          styles={buttonStyles}
        >
          <IconsFooter iconName="facebook" />
        </Button>

        <Button
          component="a"
          href="/#contact"
          variant="transparent"
          p={0}
          onClick={handleContactClick}
          styles={buttonStyles}
        >
          <IconsFooter iconName="email" />
        </Button>
      </div>
    </footer>
  )
}