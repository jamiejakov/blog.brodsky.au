import type { Page } from 'astro';

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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst href={url.first} disabled={!url.first} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href={url.prev} disabled={!url.prev} />
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
          <PaginationNext href={url.next} disabled={!url.next} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast href={url.last} disabled={!url.last} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
