const YEAR_AND_SLUG = /^(\d{4})\/(.+)$/;
const POSTS_PREFIX = '/posts/';
const MIN_QUERY_LENGTH = 4;

/**
 * Resolve a requested `/posts/...` path to a published post id when the match
 * is unambiguous. Returns undefined for missing, short, or ambiguous queries.
 */
export function findFuzzyPostMatch(pathname: string, postIds: readonly string[]): string | undefined {
  const requested = postIdFromPathname(pathname);
  if (!requested) {
    return undefined;
  }

  const requestedLower = requested.toLowerCase();
  const exact = postIds.find((id) => id.toLowerCase() === requestedLower);
  if (exact) {
    return exact;
  }

  const { year, slug } = splitPostId(requestedLower);
  if (slug.length < MIN_QUERY_LENGTH) {
    return undefined;
  }

  const candidates = year ? postIds.filter((id) => splitPostId(id).year === year) : [...postIds];

  const substringHits = candidates.filter((id) => splitPostId(id).slug.toLowerCase().includes(slug));
  const substringMatch = uniqueHit(substringHits);
  if (substringMatch) {
    return substringMatch;
  }
  if (substringHits.length > 1) {
    return undefined;
  }

  const typoHits = candidates.filter((id) => {
    const candidateSlug = splitPostId(id).slug.toLowerCase();
    if (isTypoOf(slug, candidateSlug)) {
      return true;
    }
    return slugTokens(candidateSlug).some((token) => isTypoOf(slug, token));
  });

  return uniqueHit(typoHits);
}

function splitPostId(id: string): { year: string | undefined; slug: string } {
  const match = YEAR_AND_SLUG.exec(id);
  if (match?.[1] && match[2]) {
    return { year: match[1], slug: match[2] };
  }
  return { year: undefined, slug: id };
}

function postIdFromPathname(pathname: string): string | undefined {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    // Keep the raw path if it isn't valid URI encoding.
  }

  const normalized = path.replace(/\/+$/, '') || '/';
  if (!normalized.toLowerCase().startsWith(POSTS_PREFIX)) {
    return undefined;
  }

  const id = normalized.slice(POSTS_PREFIX.length);
  return id.length > 0 ? id : undefined;
}

function slugTokens(slug: string): string[] {
  return slug.split('-').filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min((prev[j] ?? 0) + 1, (curr[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    for (let j = 0; j <= b.length; j++) {
      prev[j] = curr[j] ?? 0;
    }
  }

  return prev[b.length] ?? b.length;
}

function isTypoOf(query: string, target: string): boolean {
  if (query === target) {
    return true;
  }
  if (Math.abs(query.length - target.length) > 2) {
    return false;
  }
  const maxDistance = target.length >= 10 ? 2 : 1;
  return levenshtein(query, target) <= maxDistance;
}

function uniqueHit(hits: string[]): string | undefined {
  return hits.length === 1 ? hits[0] : undefined;
}
