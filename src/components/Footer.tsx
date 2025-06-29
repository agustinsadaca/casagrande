'use client'
import styles from '@/styles/Footer.module.css'
import IconsFooter from './IconsFooter'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
        <IconsFooter iconName="instagram" />
        <IconsFooter iconName="facebook" />
      </div>
    </footer>
  )
}
