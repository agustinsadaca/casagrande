import { ProjectItem } from '@/types/project'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import ProjectPageClient from './ProjectPageClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com'

async function getProject(projectId: string, locale: string): Promise<ProjectItem | null> {
  const fileName = locale === 'en' ? 'projects.en.json' : 'projects.es.json'
  try {
    const projectsFile = path.join(process.cwd(), `public/data/${fileName}`)
    const projects: ProjectItem[] = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
    return projects.find(p => p.id === projectId) || null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; projectName: string }> }
): Promise<Metadata> {
  const { lang, projectName } = await params
  const project = await getProject(projectName, lang)

  if (!project) return {}

  const title = project.projectName || 'Proyecto'

  const projectDesc = project.details.project?.description
  const description =
    project.subtitle ||
    (Array.isArray(projectDesc) ? projectDesc.join(', ') : projectDesc) ||
    'Proyecto de Casa Grande Ingeniería'

  const ogImageUrl = `${siteUrl}/og-image.png`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/project/${projectName}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, alt: title, type: 'image/png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ lang: string; projectName: string }> }
) {
  const { lang, projectName } = await params
  const project = await getProject(projectName, lang)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: project?.projectName || projectName,
        item: `${siteUrl}/project/${projectName}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectPageClient />
    </>
  )
}
