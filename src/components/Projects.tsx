'use client'

import styles from '@/styles/Projects.module.css'
import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ProjectItem } from '../types/project'


export default function Projects() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const autoplay = useRef(Autoplay({ delay: 5000 }))


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/data/projects.json?t=${timestamp}`)
        if (!response.ok) {
          throw new Error('Failed to fetch projects data')
        }
        console.log(response)

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

  const handleClick = (project: ProjectItem) => {
    router.push(`/en/project/${project.id}`)
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
      {!isMobile && (<div className={styles.projectsLogoImage}>
        <Image src="/logo.svg" alt="logo" className={styles.image} width={180} height={120} />
      </div>)}
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
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
                {
                  project.imageHomeUrls.map((imageUrl, index) => (
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
                  ))
                }
              </Carousel>
            ) : (
              project.imageHomeUrls.slice(0, 3).map((imageUrl, index) => (
                <div key={index}>
                  <Image
                    src={imageUrl}
                    alt={`${project.projectName} image ${index + 1}`}
                    width={398}
                    height={398}
                    className={styles.imageProjects}
                  />
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </section>
  )
}