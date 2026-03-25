import type { Page } from 'astro';
import { useCallback } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

type BlogPaginationProps = {
  url: Page['url'];
  currentPage: number;
};

export const BlogPagination: React.FC<BlogPaginationProps> = (props) => {
  const { url, currentPage } = props;

  const capturePageChange = useCallback(
    (direction: string, targetUrl: string | undefined) => {
      if (!targetUrl) {
        return;
      }
      window.posthog?.capture('blog_page_changed', { direction, from_page: currentPage, target_url: targetUrl });
    },
    [currentPage]
  );

  const onFirstClick = useCallback(() => {
    capturePageChange('first', url.first);
  }, [capturePageChange, url.first]);

  const onPreviousClick = useCallback(() => {
    capturePageChange('previous', url.prev);
  }, [capturePageChange, url.prev]);

  const onNextClick = useCallback(() => {
    capturePageChange('next', url.next);
  }, [capturePageChange, url.next]);

  const onLastClick = useCallback(() => {
    capturePageChange('last', url.last);
  }, [capturePageChange, url.last]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst href={url.first} disabled={!url.first} onClick={onFirstClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href={url.prev} disabled={!url.prev} onClick={onPreviousClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={url.current} isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={url.next} disabled={!url.next} onClick={onNextClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast href={url.last} disabled={!url.last} onClick={onLastClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
