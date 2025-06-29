'use client'

import styles from '@/styles/Project.module.css'
import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ProjectItem } from '../../../../types/project'


export default function ProjectPage() {
  const [projectData, setProjectData] = useState<ProjectItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const projectId = params.projectName as string
  const autoplay = useRef(Autoplay({ delay: 5000 }))
  const isMobile = useMediaQuery('(max-width: 768px)')


  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const datestamp = new Date().getTime()
        const response = await fetch('/data/projects.json?t=' + datestamp)
        if (!response.ok) {
          throw new Error('Failed to fetch projects data')
        }

        const projects: ProjectItem[] = await response.json()
        const foundProject = projects.find(project => project.id === projectId)

        if (!foundProject) {
          throw new Error(`Project with ID ${projectId} not found`)
        }

        setProjectData(foundProject)
      } catch (err) {
        console.error('Error loading project data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId])


  useEffect(() => {
    return () => {
      sessionStorage.setItem('comingFromProject', 'true')
    }
  }, [])

  if (loading) {
    return <div className={styles.loading}>Cargando proyecto...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (!projectData) {
    return <div className={styles.error}>No se encontró el proyecto</div>
  }

  return (
    <div className={styles.container}>
      <Image
        src="/logo.svg"
        width={150}
        height={0}
        style={{ height: 'auto' }}
        alt="Casagrande logo"
        className={styles.logo}
      />

      <div className={styles.projectContainer}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h1 className={`${styles.projectName} c131313 fs24`}>{projectData.projectName}</h1>
            {projectData.subtitle && (
              <div className={`c9A9A9A fs21`}>{projectData.subtitle}</div>
            )}
          </div>

          <div className={`${styles.column} ${styles.carouselSection}`}>
            {projectData.imageDetailUrls && projectData.imageDetailUrls.length > 0 && (
              <Carousel
                withIndicators
                withControls={false}
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
                  },
                  slide: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'auto',
                    maxHeight: '389px'
                  }
                }}
              >
                {
                  projectData.imageDetailUrls.map((imageUrl, index) => (
                    <Carousel.Slide key={index}>
                      <Image
                        src={imageUrl}
                        alt={`${projectData.projectName} - image ${index + 1}`}
                        width={710}
                        height={389}
                        className={styles.imageProjects}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }
                        }
                      />
                    </Carousel.Slide>
                  ))
                }
              </Carousel>
            )}
          </div>

          <div className={styles.column}>
            {Object.entries(projectData.details).map(([key, detail]) => (
              key === 'project' ?
                (
                  <div key={key} className={styles.detailSection}>
                    <h3 className={`c9A9A9A ${styles.detailTitle}`}>{detail.title}</h3>
                    {Array.isArray(detail.description) && detail.description.map((description, index) => (
                      <p key={index} className={`c131313 ${styles.descriptionText}`}>{description}</p>
                    ))}
                  </div>
                )
                : (
                  <div key={key} className={styles.detailSection}>
                    <h3 className={`c9A9A9A ${styles.detailTitle}`}>{detail.title}</h3>
                    <p className={`c131313 ${styles.descriptionText}`}>{detail.description}</p>
                  </div>
                )
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}