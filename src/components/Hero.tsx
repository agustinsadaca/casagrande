'use client'
import styles from '@/styles/Hero.module.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function Hero() {
  const heroRef = useRef(null)
  const logoWrapperRef = useRef(null)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const hero = heroRef.current
    const logo = logoWrapperRef.current

    if (!hero || !logo) return

    // Inicializar posición centrada
    gsap.set(logo, {
      position: 'absolute',
      top: '30%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '500px',
      height: '300px',
      zIndex: 10
    })

    // Timeline para animar logo y fijarlo al finalizar
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: '-100px top',
        end: '+=300px',
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: true,
        onUpdate: (self) => {
          if (self.progress >= 1) {
            logo.classList.add('sticky')
          } else {
            logo.classList.remove('sticky')
          }
        }
      }
    })

    // Animación del logo
    tl.to(logo, {
      top: '20px',
      left: '20px',
      xPercent: 0,
      yPercent: 0,
      width: '180px',
      height: '120px',
      ease: 'power2.inOut'
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      gsap.set(logo, { clearProps: 'all' })
    }
  }, [])


  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.logoStickyWrapper} ref={logoWrapperRef}>
        <Image
          src="/logo.svg"
          alt="Logo"
          className={styles.image}
          fill
          priority
          unoptimized
          style={{ objectFit: 'contain' }}
        />
      </div>

      <section ref={heroRef}>
        <button className={`${styles.button} fontUnageoRegularSemiBold fs24`}>
          OFICINA TÉCNICA
        </button>
      </section>
    </section>
  )
}
