// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: false, // set to false when using @vercel/analytics@1.4.0
    },
    imageService: true,
    maxDuration: 8,
  }),
  site: 'https://blog.brodsky.au',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
