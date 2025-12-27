import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

import { checkExists } from '../lib/preconditions';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'Astro Learner | Blog',
    description: 'My journey learning Astro',
    site: checkExists(context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
