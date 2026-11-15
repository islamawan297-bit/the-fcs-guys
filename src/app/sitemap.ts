import { MetadataRoute } from 'next';
import { ARTICLES_DATA, CONFERENCES_DATA } from '@/data/fcs-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thefcsguys.com';
  const currentDate = new Date().toISOString();

  // Core public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/top-25`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playoff-projections`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/conferences`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // Dynamic published article routes
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES_DATA.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic conference routes
  const conferenceRoutes: MetadataRoute.Sitemap = CONFERENCES_DATA.map((conf) => ({
    url: `${baseUrl}/conferences/${conf.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...conferenceRoutes];
}

