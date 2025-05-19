'use client'

import styles from '@/styles/Project.module.css'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type ProjectDetail = {
  title: string
  description: string | string[]
}

type ProjectData = {
  id: string
  projectName: string
  subtitle?: string
  imageUrl?: string
  details: {
    project?: ProjectDetail
    area?: ProjectDetail
    ubication?: ProjectDetail
    material?: ProjectDetail
  }
}


export default function ProjectPage() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const projectId = params.projectName as string

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch('/data/projects.json')
        if (!response.ok) {
          throw new Error('Failed to fetch projects data')
        }

        const projects: ProjectData[] = await response.json()
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
          {/* Column 1: Project Name and Subtitle */}
          <div className={styles.column}>
            <h1 className={`${styles.projectName} c131313 fs24`}>{projectData.projectName}</h1>
            {projectData.subtitle && (
              <div className={`c9A9A9A fs21`}>{projectData.subtitle}</div>
            )}
          </div>

          {/* Column 2: Project Image */}
          <div className={styles.column}>
            {projectData.imageUrl && (
              <Image
                src={projectData.imageUrl}
                alt={projectData.projectName}
                width={710}
                height={389}
                className={styles.projectImage}
              />
            )}
          </div>

          {/* Column 3: Project Details */}
          <div className={styles.column}>
            {Object.entries(projectData.details).map(([key, detail]) => (
              detail && (
                <div key={key} className={styles.detailSection}>
                  <h3 className={`c9A9A9A ${styles.detailTitle}`}>{detail.title}</h3>
                  <p className={`c131313 ${styles.descriptionText}`}>{detail.description}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}