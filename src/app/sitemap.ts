import fs from 'fs'
import type { MetadataRoute } from 'next'
import path from 'path'

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com').replace(/\/$/, '')

const langs = ['es', 'en']

const bannedSegments = ['/admin', '/api', '/layout', '/routing-test']

const staticPriority: Record<string, number> = {
  '/': 0.9,
  '/proyectos': 0.8,
  '/servicios': 0.8,
  '/contacto': 0.8,
  '/oficina': 0.7,
}

const staticChangeFreq: Record<string, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  '/': 'daily',
  '/proyectos': 'weekly',
  '/servicios': 'weekly',
  '/contacto': 'weekly',
}

function getProjectIds(): string[] {
  try {
    const file = path.join(process.cwd(), 'public/data/projects.es.json')
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return data.map((p: { id: string }) => p.id)
  } catch {
    return []
  }
}

function getStaticRoutes(): string[] {
  const routesDir = path.join(process.cwd(), 'src/app/[lang]')
  return traversePages(routesDir, routesDir)
}

function traversePages(baseDir: string, dir: string): string[] {
  const results: string[] = []
  const list = fs.readdirSync(dir)

  for (const file of list) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip dynamic project route — expanded separately
      if (file === '[projectName]') continue
      results.push(...traversePages(baseDir, fullPath))
    } else if (file === 'page.tsx') {
      // Convert to URL path
      const relative = fullPath
        .replace(baseDir, '')
        .replace(/\\/g, '/')
        .replace('/page.tsx', '') || '/'
      results.push(relative)
    }
  }

  return results
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = getStaticRoutes().filter(
    route => !bannedSegments.some(banned => route.startsWith(banned))
  )
  const projectIds = getProjectIds()
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const lang of langs) {
    for (const route of staticRoutes) {
      const url = `${baseUrl}/${lang}${route === '/' ? '' : route}`
      entries.push({
        url,
        lastModified,
        changeFrequency: staticChangeFreq[route] ?? 'monthly',
        priority: staticPriority[route] ?? 0.5,
      })
    }

    for (const id of projectIds) {
      entries.push({
        url: `${baseUrl}/${lang}/project/${id}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
