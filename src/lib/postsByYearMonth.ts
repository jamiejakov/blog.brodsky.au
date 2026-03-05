export const MONTH_NAMES: Record<string, string> = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

type PostWithPubDate = { data: { pubDate: Date }; id: string };

export function groupPostsByYearMonth<T extends PostWithPubDate>(posts: T[]): [string, { heading: string; posts: T[] }][] {
  const grouped = new Map<string, { heading: string; posts: T[] }>();

  for (const post of posts) {
    const year = post.data.pubDate.getFullYear();
    const month = String(post.data.pubDate.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;
    const heading = `${year} ${MONTH_NAMES[month]}`;

    if (!grouped.has(key)) {
      grouped.set(key, { heading, posts: [] });
    }
    grouped.get(key)!.posts.push(post);
  }

  return [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}
