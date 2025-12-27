// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 8,
  }),
  site: 'https://blog.brodsky.au',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
