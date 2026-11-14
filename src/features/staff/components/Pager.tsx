import NextLink from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import styles from './Staff.module.css';

interface Props {
  page: number;
  pageSize: number;
  total: number;
  href: (page: number) => string;
}

export function Pager({ page, pageSize, total, href }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages === 1) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return (
    <nav aria-label="Pages" className={styles.pager}>
      <span className={styles.count}>
        {first} to {last} of {total}
      </span>
      <span className={styles.pagerLinks}>
        {page > 1 ? (
          <NextLink href={href(page - 1)} rel="prev">
            <ChevronLeftIcon />
            Previous
          </NextLink>
        ) : (
          <span aria-hidden="true">
            <ChevronLeftIcon />
            Previous
          </span>
        )}
        {page < pages ? (
          <NextLink href={href(page + 1)} rel="next">
            Next
            <ChevronRightIcon />
          </NextLink>
        ) : (
          <span aria-hidden="true">
            Next
            <ChevronRightIcon />
          </span>
        )}
      </span>
    </nav>
  );
}

export const pageOf = (value: string | undefined, total: number, pageSize: number) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(page) ? Math.min(Math.max(page, 1), pages) : 1;
};
