import { getCollection } from 'astro:content';

export async function getAllPosts() {
  const allPosts = (await getCollection('blog')).filter(({ data }) => data.published);
  return allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
