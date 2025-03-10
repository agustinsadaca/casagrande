

import fs from 'fs'
import type { MetadataRoute } from 'next'
import path from 'path'

const baseUrl = '';

// These are the paths/lonks that should not be present in sitemap
const bannedPaths = [
  '/admin', '/api', '/layout', '/view', '/preload-resources'
];


export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getRoutes(); // Retrieve all available routes for the application

  // Filter out routes that include any banned paths and check if the current route includes any of the banned paths
  const filteredRoutes = routes.filter(route => !bannedPaths.some(bp => route.includes(bp)));
  
  /* 
    Map the filtered routes to sitemap entries with specific properties 
    Construct the full URL for the sitemap entry
  */
  const sitemapEntries = filteredRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.5
  }));

  // Uncomment this when you make changes for staticPaths
  
  /* const staticEntries = staticPaths.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.8
  })); 

  return [
    ...sitemapEntries,
    ...staticEntries
  ]; */

  return [
    ...sitemapEntries
  ]
}

function getRoutes() {
  const routesDir = path.join(process.cwd(), 'src/app/[lang]');
  const routes = traverseRoutes(routesDir);
  return routes.map(route => route.replace(process.cwd() + '/src/app/[lang]', '').replace('.tsx', '').replace('/page', '') || '/');
}

function traverseRoutes(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(traverseRoutes(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });

  return results;
}