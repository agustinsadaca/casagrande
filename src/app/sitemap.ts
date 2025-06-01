import fs from 'fs'
import type { MetadataRoute } from 'next'
import path from 'path'

// Set your actual domain here
const baseUrl = 'https://yourdomain.com'

// Paths to exclude from the sitemap
const bannedPaths = [
  '/admin', '/api', '/layout', '/view', '/preload-resources'
]

// Important static paths with higher priority
const importantPaths = [
  '/', '/proyectos', '/servicios', '/contacto'
]

// Project paths from your data
// This assumes you have a projects.json file
const getProjectPaths = (): string[] => {
  try {
    const projectsFile = path.join(process.cwd(), 'public/data/projects.json')
    const projectsData = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
    return projectsData.map(project => `/project/${project.id}`)
  } catch (error) {
    console.warn('Could not load project paths:', error)
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getRoutes()
  const projectPaths = getProjectPaths()

  // Filter out banned paths
  const filteredRoutes = routes.filter(route =>
    !bannedPaths.some(bp => route.includes(bp))
  )

  // Create sitemap entries with varied priorities based on importance
  const sitemapEntries = filteredRoutes.map(route => {
    // Determine priority based on path importance
    const priority =
      route === '/' ? 0.9 :  // Homepage gets highest priority
        importantPaths.includes(route) ? 0.8 : // Important sections
          projectPaths.includes(route) ? 0.7 :   // Project pages
            0.5                                   // Other pages

    // Determine change frequency based on content type
    const changeFrequency =
      route === '/' ? 'daily' as const :
        importantPaths.includes(route) ? 'weekly' as const :
          'monthly' as const

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: changeFrequency,
      priority: priority
    }
  })

  // Add language variants for important pages
  const languageVariants = ['en', 'de'].flatMap(lang =>
    importantPaths.map(route => ({
      url: `${baseUrl}/${lang}${route === '/' ? '' : route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  )

  return [
    ...sitemapEntries,
    ...languageVariants
  ]
}

function getRoutes() {
  const routesDir = path.join(process.cwd(), 'src/app/[lang]')
  const routes = traverseRoutes(routesDir)
  return routes.map(route =>
    route.replace(process.cwd() + '/src/app/[lang]', '')
      .replace('.tsx', '')
      .replace('/page', '') || '/'
  )
}

function traverseRoutes(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)

  list.forEach(file => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)

    if (stat && stat.isDirectory()) {
      results = results.concat(traverseRoutes(file))
    } else if (file.endsWith('.tsx')) {
      results.push(file)
    }
  })

  return results
}