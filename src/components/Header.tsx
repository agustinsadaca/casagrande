'use client'
import styles from '@/styles/Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <link rel="icon" type="image/webp" href="/favicon.webp" />
      <link href="https://db.onlinewebfonts.com/c/41e182101f3f3414dbfea04a955f765c?family=Altone+Trial" rel="stylesheet"></link>
      <div className={styles.logo}>CASAGRANDE<br />INGENIERIA
      </div>
      <nav className={styles.nav}>
        <a href="#projects">PROYECTOS</a>
        <a href="#office">OFICINA</a>
        <a href="#contact">CONTACTO</a>
      </nav>
    </header>
  )
}
