/** Matches markdown horizontal rule: ---, ***, or ___ on its own line */
const MARKDOWN_HR_REGEX = /^(?:---|\*\*\*|___)\s*$/m;

/** Returns true if the markdown body contains a horizontal rule (used for excerpt truncation). */
export function markdownHasHr(body: string | undefined): boolean {
  return !!body && MARKDOWN_HR_REGEX.test(body);
}

/**
 * Truncates HTML string at the first <hr> tag.
 * Removes everything after (and including) the <hr> tag.
 */
export function truncateHtmlAtHr(html: string): string {
  if (!html) {
    return html;
  }

  // Find the first <hr> tag (can be <hr>, <hr/>, or <hr />)
  const hrRegex = /<hr\s*\/?>/i;
  const match = hrRegex.exec(html);

  if (!match?.index) {
    // <hr> tag not found, return original HTML
    return html;
  }

  // Truncate at the <hr> tag (remove the <hr> and everything after it)
  return html.substring(0, match.index);
}
