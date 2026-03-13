/**
 * Remark plugin for YouTube embeds.
 * Converts bare YouTube URLs to embeds; markdown links [text](url) stay as links.
 */
import { visit } from 'unist-util-visit';

const YOUTUBE_URL_PATTERN =
  /^https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]+)/;

function extractVideoId(url) {
  const match = String(url).match(YOUTUBE_URL_PATTERN);
  return match?.[1] ?? null;
}

function isAutolink(node) {
  if (node.type !== 'link') return false;
  const text = node.children?.map((c) => c?.value ?? '').join('');
  return text === node.url;
}

export function remarkYoutubeExplicit() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      if (node.children.length !== 1) return;

      const child = node.children[0];
      let videoId = null;

      if (child.type === 'text') {
        videoId = extractVideoId(child.value);
      } else if (child.type === 'link' && isAutolink(child)) {
        videoId = extractVideoId(child.url);
      }

      if (!videoId) return;

      node.children = [
        {
          type: 'html',
          value: `<iframe src="https://www.youtube.com/embed/${videoId}" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
        },
      ];
    });
  };
}
