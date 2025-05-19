'use client'

import styles from '@/styles/Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <img src="/logo.svg" alt="logo" className={styles.image} />
      <button className={`${styles.button} fontUnageoRegularSemiBold fs24`} type="button">
        OFICINA TÉCNICA
      </button>
    </section>
  )
}
