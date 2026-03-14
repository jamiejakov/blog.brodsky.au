// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { remarkYoutubeExplicit } from './scripts/remark-youtube-explicit.js';
import { remarkImgurAlbum } from './scripts/remark-imgur-album.js';

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
  markdown: {
    remarkPlugins: [remarkAlert, remarkYoutubeExplicit, remarkImgurAlbum],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
