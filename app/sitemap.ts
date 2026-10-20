import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://flammy.vercel.app/', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://flammy.vercel.app/privacidade', changeFrequency: 'yearly', priority: 0.3 },
  ];
}
