// @ts-check
import { defineConfig } from 'astro/config';
// Also can be @astrojs/vercel/static
import vercel from '@astrojs/vercel/serverless';
import tailwindcss from "@tailwindcss/vite";
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