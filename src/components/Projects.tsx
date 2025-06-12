'use client'

import styles from '@/styles/Projects.module.css'
import { Carousel } from '@mantine/carousel'
import { Box } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUp } from '@tabler/icons-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ProjectItem } from '../types/project'
import { ContactForm } from './ContactForm'

export default function Projects() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const autoplay = useRef(Autoplay({ delay: 5000 }))
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/data/projects.json?t=${timestamp}`)
        if (!response.ok) {
          throw new Error('Failed to fetch projects data')
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error('Error loading projects:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash

      if (hash && loading === false) {
        setTimeout(() => {
          const id = hash.substring(1)
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 200)
      }
    }

    handleHashScroll()
    window.addEventListener('hashchange', handleHashScroll)

    return () => {
      window.removeEventListener('hashchange', handleHashScroll)
    }
  }, [loading, pathname, searchParams])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleClick = (project: ProjectItem) => {
    router.push(`/en/project/${project.id}`)
  }

  const handleRowHoverStart = (index: number) => {
    setHoveredRow(index)
  }

  const handleRowHoverEnd = () => {
    setHoveredRow(null)
  }

  if (loading) {
    return <div className={styles.loading}>Loading projects...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (projects.length === 0) {
    return <div className={styles.error}>No projects found</div>
  }

  return (
    <section id="projects" className={styles.projectsSection}>
      {!isMobile && (
        <div className={styles.projectsLogoImage}>
          <Image src="/logo.svg" alt="logo" className={styles.image} width={180} height={120} />
        </div>
      )}
      <div className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => handleClick(project)}
            className={styles.projectCard}
            style={{ cursor: 'pointer' }}
          >
            {isMobile ? (
              <Carousel
                withIndicators
                withControls={false}
                height={389}
                className={styles.projectImage}
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={() => autoplay.current.play()}
                styles={{
                  indicators: {
                    bottom: '1rem',
                  },
                  indicator: {
                    width: 12,
                    height: 4,
                    transition: 'width 250ms ease',
                    backgroundColor: 'white',
                  }
                }}
              >
                {project.imageHomeUrls.map((imageUrl, index) => (
                  <Carousel.Slide key={index}>
                    <Image
                      src={imageUrl}
                      alt={`${project.projectName} - image ${index + 1}`}
                      width={710}
                      height={389}
                      className={styles.imageProjects}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            ) : (
              <div
                className={styles.imageRow}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {project.imageHomeUrls.slice(0, 3).map((imageUrl, imgIndex) => (
                  <div key={imgIndex} className={styles.imageContainer}> {/* Changed class name */}
                    <div className={styles.imageWrapper}>
                      <Image
                        src={imageUrl}
                        alt={`${project.projectName} image ${imgIndex + 1}`}
                        width={398}
                        height={398}
                        className={styles.imageProjects}
                        priority={imgIndex === 0}
                        loading={imgIndex === 0 ? 'eager' : 'lazy'}
                      />
                      <motion.div
                        className={styles.overlayContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredRow === index ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        {imgIndex === 0 && (
                          <h2 className={`fs16 ${styles.overlayText}`}>
                            {project.projectName.toUpperCase()}
                          </h2>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Box style={{ marginLeft: isMobile ? '0px' : '150px' }}>
        <ContactForm />
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px', marginLeft: isMobile ? '0px' : '150px' }} my="xl">
        <button
          onClick={handleScrollToTop}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#868e96',
            cursor: 'pointer',
            padding: isMobile ? '0px' : '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '90px' : '130px',
            height: isMobile ? '90px' : '130px'
          }}
          aria-label="Scroll to top"
        >
          <IconArrowUp size={120} stroke={.6} />
        </button>
      </Box>

    </section>
  )
}