'use client'

import styles from '@/styles/Project.module.css'
import { Carousel } from '@mantine/carousel'
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


  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch('/data/projects.json')
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

          <div className={styles.column}>
            {projectData.imageDetailUrls && projectData.imageDetailUrls.length > 0 && (
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
                    '&[data-active]': {
                      backgroundColor: '#9A9A9A',
                    }
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
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }
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