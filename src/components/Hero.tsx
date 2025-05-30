'use client'
import styles from '@/styles/Hero.module.css'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image src="/logo.svg" alt="logo" className={styles.image} width={180} height={120} />
      <button className={`${styles.button} fontUnageoRegularSemiBold fs24`} type="button">
        OFICINA TÉCNICA
      </button>
    </section>
  )
}
