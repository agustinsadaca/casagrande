import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/static/chunks/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/projects/', '/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
