import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://lockpulse.codedigit.in'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/', '/collaborate/', '/profile/', '/project/', '/vault/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
