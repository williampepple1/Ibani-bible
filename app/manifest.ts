import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ibani Audio Bible',
    short_name: 'Ibani Bible',
    description: 'Read and listen to the Holy Bible in the Ibani language.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#0d1117',
    icons: [
      {
        src: '/apple-icon',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
