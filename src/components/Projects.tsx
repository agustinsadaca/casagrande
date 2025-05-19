'use client'

import styles from '@/styles/Projects.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type ProjectDetail = {
  title: string
  description: string | string[]
}

export type ProjectItem = {
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

export default function Projects() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/data/projects.json')
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
      <h2 className={styles.sectionTitle}>Nuestros Proyectos</h2>
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleClick(project)}
            className={styles.projectCard}
            style={{ cursor: 'pointer' }}
          >
            {project.imageUrl && (
              <div className={styles.projectImageWrapper}>
                <Image
                  src={project.imageUrl}
                  alt={project.projectName}
                  width={300}
                  height={200}
                  className={styles.projectThumbnail}
                />
              </div>
            )}
            <h3 className={styles.projectTitle}>{project.projectName}</h3>
            {project.subtitle && (
              <p className={styles.projectSubtitle}>{project.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}