/**
 * Remark plugin for Imgur album embeds.
 * Converts bare Imgur album URLs to embeds; markdown links [text](url) stay as links.
 */
import { visit } from 'unist-util-visit';

const IMGUR_ALBUM_URL_PATTERN =
  /^(?:https?:)?\/\/(?:www\.)?imgur\.com\/a\/([0-9A-Za-z]+)/;

function extractAlbumId(url) {
  const match = String(url).match(IMGUR_ALBUM_URL_PATTERN);
  return match?.[1] ?? null;
}

function isAutolink(node) {
  if (node.type !== 'link') return false;
  const text = node.children?.map((c) => c?.value ?? '').join('');
  return text === node.url;
}

function toEmbedHtml(albumId) {
  return `<blockquote class="imgur-embed-pub" lang="en" data-id="a/${albumId}"><a href="https://imgur.com/a/${albumId}">View album on Imgur</a></blockquote><script async src="https://s.imgur.com/min/embed.js" charset="utf-8"></script>`;
}

export function remarkImgurAlbum() {
  return (tree) => {
    // Convert bare Imgur album URLs (on their own line)
    visit(tree, 'paragraph', (node) => {
      if (node.children.length !== 1) return;

      const child = node.children[0];
      let albumId = null;

      if (child.type === 'text') {
        albumId = extractAlbumId(child.value);
      } else if (child.type === 'link' && isAutolink(child)) {
        albumId = extractAlbumId(child.url);
      }

      if (!albumId) return;

      node.children = [
        { type: 'html', value: toEmbedHtml(albumId) },
      ];
    });

    // Convert existing iframe HTML to blockquote embed (for backwards compatibility)
    visit(tree, 'html', (node) => {
      const iframeMatch = node.value.match(
        /<iframe[^>]*src="(?:https?:)?\/\/(?:www\.)?imgur\.com\/a\/([0-9A-Za-z]+)[^"]*"[^>]*>/i
      );
      if (iframeMatch) {
        node.value = toEmbedHtml(iframeMatch[1]);
      }
    });
  };
}
