import Projects from '@/components/Projects'
import { Metadata } from 'next'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com').replace(/\/$/, '')

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params
  const isEs = lang === 'es'

  return {
    title: isEs ? 'Proyectos' : 'Projects',
    description: isEs
      ? 'Portfolio de ingeniería estructural: viviendas, edificios y proyectos de arquitectura en Mendoza, Argentina. Cálculo de estructuras e instalaciones.'
      : 'Structural engineering portfolio: houses, buildings and architecture projects in Mendoza, Argentina. Structural calculation and installations.',
    alternates: {
      canonical: `${siteUrl}/${lang}/projects`,
      languages: {
        es: `${siteUrl}/es/projects`,
        en: `${siteUrl}/en/projects`,
      },
    },
  }
}

export default function ProjectsPage() {
  return <Projects />
}
