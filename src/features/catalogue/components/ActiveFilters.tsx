import NextLink from 'next/link';
import type { FacetCount } from '@/features/search';
import styles from './Listing.module.css';

interface ActiveFiltersProps {
  facets: FacetCount[];
  removeHref: (facet: string, slug: string) => string;
  clearHref: string;
}

export function ActiveFilters({ facets, removeHref, clearHref }: ActiveFiltersProps) {
  const active = facets.flatMap((facet) =>
    facet.values.filter((value) => value.selected).map((value) => ({ facet, value })),
  );
  if (active.length === 0) return null;
  return (
    <ul className={styles.active} aria-label="Filters applied">
      {active.map(({ facet, value }) => (
        <li key={`${facet.id}-${value.slug}`}>
          <NextLink href={removeHref(facet.id, value.slug)} scroll={false} className={styles.chip}>
            <span className={styles.visuallyHidden}>Remove </span>
            {facet.label}: {value.label}
          </NextLink>
        </li>
      ))}
      <li>
        <NextLink href={clearHref} scroll={false}>
          Clear filters
        </NextLink>
      </li>
    </ul>
  );
}
