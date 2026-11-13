import NextLink from 'next/link';
import styles from './Listing.module.css';

interface PaginationProps {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}

export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return (
    <nav aria-label="Pages" className={styles.pagination}>
      <ul>
        {page > 1 && (
          <li>
            <NextLink href={hrefFor(page - 1)} rel="prev">
              Previous
            </NextLink>
          </li>
        )}
        {pages.map((number) => (
          <li key={number}>
            {number === page ? (
              <span aria-current="page">{number}</span>
            ) : (
              <NextLink href={hrefFor(number)} aria-label={`Page ${number}`}>
                {number}
              </NextLink>
            )}
          </li>
        ))}
        {page < pageCount && (
          <li>
            <NextLink href={hrefFor(page + 1)} rel="next">
              Next
            </NextLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
