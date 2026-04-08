import { ProjectItem } from '@/types/project'
import fs from 'fs'
import { Metadata } from 'next'
import path from 'path'
import ProjectPageClient from './ProjectPageClient'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com').replace(/\/$/, '')

function getProjects(locale: string): ProjectItem[] {
  const fileName = locale === 'en' ? 'projects.en.json' : 'projects.es.json'
  try {
    const file = path.join(process.cwd(), `public/data/${fileName}`)
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const projects = getProjects('es')
  return ['es', 'en'].flatMap(lang =>
    projects
      .filter(p => (p as ProjectItem & { visible?: boolean }).visible !== false)
      .map(p => ({ lang, projectName: p.id }))
  )
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; projectName: string }> }
): Promise<Metadata> {
  const { lang, projectName } = await params
  const project = getProjects(lang).find(p => p.id === projectName)

  if (!project) return {}

  const title = project.projectName || 'Proyecto'

  const projectDesc = project.details.project?.description
  const services = Array.isArray(projectDesc) ? projectDesc.join(' · ') : projectDesc
  const area = project.details.area?.description
  const location = project.details.ubication?.description

  const description = [project.subtitle, services, area, location]
    .filter(Boolean)
    .join(' — ')
    .slice(0, 160) || 'Proyecto de CASAGRANDE INGENIERIA'

  const ogImage = project.imageDetailUrls?.[0]
    ? `${siteUrl}${project.imageDetailUrls[0]}`
    : `${siteUrl}/og-image.png`

  const alternates = {
    canonical: `${siteUrl}/${lang}/project/${projectName}`,
    languages: {
      es: `${siteUrl}/es/project/${projectName}`,
      en: `${siteUrl}/en/project/${projectName}`,
    },
  }

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ lang: string; projectName: string }> }
) {
  const { lang, projectName } = await params
  const project = getProjects(lang).find(p => p.id === projectName)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'es' ? 'Inicio' : 'Home', item: `${siteUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: lang === 'es' ? 'Proyectos' : 'Projects', item: `${siteUrl}/${lang}/projects` },
      { '@type': 'ListItem', position: 3, name: project?.projectName || projectName, item: `${siteUrl}/${lang}/project/${projectName}` },
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
