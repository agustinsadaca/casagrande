'use client'
import styles from '@/styles/Hero.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [logoUrl, setLogoUrl] = useState('/logo.svg')

  useEffect(() => {
    setLogoUrl(`/logo.svg?v=${Date.now()}`)
  }, [])
  return (
    <section className={styles.hero}>
      <div className={styles.logoWrapper}>
        <Image
          src={logoUrl}
          alt="Logo"
          className={styles.image}
          width={180}
          height={120}
          priority={true}
          unoptimized={true}
        />
      </div>
      <button className={`${styles.button} fontUnageoRegularSemiBold fs24`} type="button">
        OFICINA TÉCNICA
      </button>
    </section>
  )
}
