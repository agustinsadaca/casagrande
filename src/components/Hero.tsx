'use client'
import styles from '@/styles/Hero.module.css'
import { useMediaQuery } from '@mantine/hooks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'

export default function Hero() {
  const heroRef = useRef(null)
  const logoWrapperRef = useRef(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [animationKey, setAnimationKey] = useState(0)
  const hasInitiallyAnimated = useRef(false)
  const isMobile = useMediaQuery('(max-width:  1024px)')

  const triggerSvgAnimation = () => {
    setAnimationKey(prev => prev + 1)
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const hero = heroRef.current
    const logo = logoWrapperRef.current

    if (!hero || !logo || isMobile) return

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: '-100px top',
        end: '+=110px',
        scrub: true,
        pin: false,
        anticipatePin: 1,
        markers: false,
        onEnter: () => {
          gsap.set(logo, { zIndex: 100 })
          if (hasInitiallyAnimated.current) {
            triggerSvgAnimation()
          }
        },
        onUpdate: (self) => {
          if (self.progress >= 0.99) {
            gsap.set(logo, {
              position: 'fixed',
              top: '30px',
              left: '60px'
            })
          } else {
            gsap.set(logo, { position: 'absolute' })
          }
        },
        onLeaveBack: () => {
          gsap.set(logo, {
            position: 'absolute',
            clearProps: 'top,left'
          })
          triggerSvgAnimation()
        }
      }
    })


    tl.to(logo, {
      top: '30px',
      left: '60px',
      xPercent: 0,
      yPercent: 0,
      width: '196px',
      height: '84px',
      zIndex: 100,
      ease: 'power2.inOut'
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      gsap.set(logo, { clearProps: 'all' })
    }
  }, [isMobile])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const line1 = svg.querySelector('.animate-line1')
    const line2 = svg.querySelector('.animate-line2')

    if (line1 && line2) {
      if (animationKey > 0) {
        line1.classList.remove('animate-line1')
        line2.classList.remove('animate-line2')

        void svg.getBoundingClientRect()

        line1.classList.add('animate-line1')
        line2.classList.add('animate-line2')
      }

      if (!hasInitiallyAnimated.current) {
        hasInitiallyAnimated.current = true
      }
    }
  }, [animationKey])

  useEffect(() => {
    if (!isMobile) return

    let lastScrollY = window.scrollY
    let hasScrolledDown = false
    let isInitialLoad = true

    // Prevent triggering on initial load
    const initTimer = setTimeout(() => {
      isInitialLoad = false
    }, 500)

    const handleScroll = () => {
      if (isInitialLoad) return

      const currentScrollY = window.scrollY

      if (currentScrollY > 200) {
        hasScrolledDown = true
      }

      if (currentScrollY < lastScrollY && hasScrolledDown && currentScrollY < 100) {
        triggerSvgAnimation()
        hasScrolledDown = false
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(initTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.logoStickyWrapper} ref={logoWrapperRef}>
        {!isMobile ? (
          <Link href="/" className={styles.logoLink}>
            <Logo ref={svgRef} className={styles.image} animate={true} />
          </Link>
        ) : (
          <Logo ref={svgRef} className={styles.image} animate={true} />
        )}
      </div>

      <section ref={heroRef}>
        <button className={`${styles.button} fontUnageoRegularSemiBold fs24`}>
          OFICINA TÉCNICA
        </button>
      </section>
    </section>
  )
}
