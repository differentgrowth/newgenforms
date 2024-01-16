import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: 'https://www.newgenforms.com',
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'yearly'
    }
  ];
};

export default sitemap;