import NextLink from 'next/link';
import styles from './Listing.module.css';

interface PaginationProps {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  // Stay where the list is rather than jump to the top of the page.
  keepScroll?: boolean;
}

export function Pagination({ page, pageCount, hrefFor, keepScroll = false }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return (
    <nav aria-label="Pages" className={styles.pagination}>
      <ul>
        {page > 1 && (
          <li>
            <NextLink scroll={!keepScroll} href={hrefFor(page - 1)} rel="prev">
              Previous
            </NextLink>
          </li>
        )}
        {pages.map((number) => (
          <li key={number}>
            {number === page ? (
              <span aria-current="page">{number}</span>
            ) : (
              <NextLink scroll={!keepScroll} href={hrefFor(number)} aria-label={`Page ${number}`}>
                {number}
              </NextLink>
            )}
          </li>
        ))}
        {page < pageCount && (
          <li>
            <NextLink scroll={!keepScroll} href={hrefFor(page + 1)} rel="next">
              Next
            </NextLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
