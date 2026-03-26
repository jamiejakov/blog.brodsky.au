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

      // Wrap the image in a button (PhotoSwipe only reads data-pswp-* from <a> by default;
      // we bridge buttons via the `domItemData` filter below).
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.pswpSrc = pswpSrc;
      btn.style.cursor = 'zoom-in';
      btn.setAttribute('aria-label', img.alt.trim() ? `View larger: ${img.alt}` : 'View larger image');

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w && h) {
        btn.dataset.pswpWidth = String(w);
        btn.dataset.pswpHeight = String(h);
      } else {
        img.addEventListener(
          'load',
          () => {
            const w2 = img.naturalWidth;
            const h2 = img.naturalHeight;
            if (w2 && h2) {
              btn.dataset.pswpWidth = String(w2);
              btn.dataset.pswpHeight = String(h2);
            }
          },
          { once: true }
        );
      }

      img.replaceWith(btn);
      btn.appendChild(img);
    }

    const lightbox = new PhotoSwipeLightbox({
      gallery: article,
      // Annotated image triggers only: our <button> wrappers + markdown links around images.
      children: 'button[data-pswp-src], a[data-pswp-src]',
      pswpModule: () => import('photoswipe'),
      // Hide built-in UI controls (you can still swipe/drag or click the image).
      arrowPrev: false,
      arrowNext: false,
      counter: false,
      // Prevent left/right navigation via keyboard arrows.
      arrowKeys: false,
    });

    lightbox.addFilter('domItemData', (itemData, element) => {
      if (element instanceof HTMLButtonElement && element.dataset.pswpSrc && !element.querySelector('a')) {
        const width = element.dataset.pswpWidth ? parseInt(element.dataset.pswpWidth, 10) : 0;
        const height = element.dataset.pswpHeight ? parseInt(element.dataset.pswpHeight, 10) : 0;
        const thumbnailEl = element.querySelector('img');
        return {
          ...itemData,
          element,
          src: element.dataset.pswpSrc,
          width,
          height,
          w: width,
          h: height,
          ...(thumbnailEl
            ? {
                msrc: thumbnailEl.currentSrc || thumbnailEl.src,
                alt: thumbnailEl.getAttribute('alt') ?? '',
              }
            : {}),
        };
      }
      return itemData;
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  return null;
}
