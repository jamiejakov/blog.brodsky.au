import { getCollection } from 'astro:content';

/**
 * Get all published posts
 * @param count - The number of posts to return (if not provided, all posts will be returned)
 * @returns An array of posts
 */
export async function getPosts(count?: number) {
  const allPosts = (await getCollection('blog')).filter(({ data }) => data.published);
  const sortedPosts = allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const chosenPosts = count ? sortedPosts.slice(0, count) : sortedPosts;
  return chosenPosts;
}
