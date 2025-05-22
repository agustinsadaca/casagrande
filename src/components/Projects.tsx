'use client'

import styles from '@/styles/Projects.module.css'
import { useMediaQuery } from '@mantine/hooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProjectItem } from '../types/project'


export default function Projects() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

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
              <Image
                src={project.imageHomeUrls[0]}
                alt={`${project.projectName} image`}
                width={398}
                height={398}
                objectFit="cover"
              />
            ) : (
              project.imageHomeUrls.map((imageUrl, index) => (
                <div key={index}>
                  <Image
                    src={imageUrl}
                    alt={`${project.projectName} image ${index + 1}`}
                    width={398}
                    height={398}
                    objectFit="cover"
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