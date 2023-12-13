import { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '*'
    },
    sitemap: 'https://www.newgenforms.com/sitemap.xml'
  };
};

export default robots;