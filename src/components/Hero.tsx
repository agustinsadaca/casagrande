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
        start: '-180px top',
        end: '+=193px',
        scrub: true,
        pin: false,
        anticipatePin: 1,
        markers: true,
        onEnter: () => {
          // Set high z-index at the beginning of the animation
          gsap.set(logo, { zIndex: 100 })
        },
        onUpdate: (self) => {
          // When animation completes, make it fixed
          if (self.progress >= 0.99) {
            gsap.set(logo, {
              position: 'fixed',
              top: '30px',
              left: '40px'
            })
          } else {
            // During animation, keep it absolute but with high z-index
            gsap.set(logo, { position: 'absolute' })
          }
        },
        onLeaveBack: () => {
          // Reset when scrolling back up
          gsap.set(logo, {
            position: 'absolute',
            clearProps: 'top,left'
          })
        }
      }
    })


    // Animación del logo
    tl.to(logo, {
      top: '20px',
      left: '40px',
      xPercent: 0,
      yPercent: 0,
      width: '280px',
      height: '120px',
      zIndex: 100,
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
