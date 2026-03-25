import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { useEffect } from 'react';

import 'photoswipe/dist/photoswipe.css';

export default function PhotoSwipeClient() {
  useEffect(() => {
    const maybeArticle = document.querySelector('article.full-post');
    if (!(maybeArticle instanceof HTMLElement)) {
      return;
    }
    const article = maybeArticle;

    if (article.dataset.photoswipeInitialized === 'true') {
      return;
    }
    article.dataset.photoswipeInitialized = 'true';

    const images = Array.from(article.querySelectorAll('img'));

    for (const img of images) {
      const pswpSrc = (img.currentSrc || img.src || '').trim();
      if (!pswpSrc) {
        continue;
      }

      const existingAnchor = img.closest('a');

      if (existingAnchor instanceof HTMLAnchorElement) {
        // If the image is already wrapped in a link, just mark it for PhotoSwipe.
        existingAnchor.dataset.pswpSrc ??= pswpSrc;
        if (!existingAnchor.href) {
          existingAnchor.href = pswpSrc;
        }

        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (w && h) {
          existingAnchor.dataset.pswpWidth = String(w);
          existingAnchor.dataset.pswpHeight = String(h);
        } else {
          img.addEventListener(
            'load',
            () => {
              const w2 = img.naturalWidth;
              const h2 = img.naturalHeight;
              if (w2 && h2) {
                existingAnchor.dataset.pswpWidth = String(w2);
                existingAnchor.dataset.pswpHeight = String(h2);
              }
            },
            { once: true }
          );
        }
        continue;
      }

      // Wrap the image with an anchor so PhotoSwipe can treat it as a gallery item.
      const a = document.createElement('a');
      a.href = pswpSrc;
      a.dataset.pswpSrc = pswpSrc;
      a.style.textDecoration = 'none';
      a.style.cursor = 'zoom-in';
      a.style.display = 'inline-block';

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w && h) {
        a.dataset.pswpWidth = String(w);
        a.dataset.pswpHeight = String(h);
      } else {
        img.addEventListener(
          'load',
          () => {
            const w2 = img.naturalWidth;
            const h2 = img.naturalHeight;
            if (w2 && h2) {
              a.dataset.pswpWidth = String(w2);
              a.dataset.pswpHeight = String(h2);
            }
          },
          { once: true }
        );
      }

      img.replaceWith(a);
      a.appendChild(img);
    }

    const lightbox = new PhotoSwipeLightbox({
      gallery: article,
      children: 'a',
      pswpModule: () => import('photoswipe'),
      // Hide built-in UI controls (you can still swipe/drag or click the image).
      arrowPrev: false,
      arrowNext: false,
      counter: false,
      // Prevent left/right navigation via keyboard arrows.
      arrowKeys: false,
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  return null;
}
