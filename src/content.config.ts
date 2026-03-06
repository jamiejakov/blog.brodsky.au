import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
  loader: glob({
    pattern: '{*.md,[0-9][0-9][0-9][0-9]/**/*.md}',
    base: './src/blog',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      category: z.string().optional(),
      tags: z.array(z.string()),
      published: z.boolean().optional(),
    }),
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog };
