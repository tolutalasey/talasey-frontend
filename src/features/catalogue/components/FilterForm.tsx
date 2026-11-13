import type { FacetCount, Sort } from '@/features/search';
import type { CuratedTarget } from '@/lib/listing-href';
import { ApplyOnChange } from './ApplyOnChange';
import styles from './Listing.module.css';

const SORT_LABELS: Record<Sort, string> = {
  relevance: 'Recommended',
  'price-low': 'Price, low to high',
  'price-high': 'Price, high to low',
  name: 'Name, A to Z',
};

interface FilterFormProps {
  action: string;
  facets: FacetCount[];
  sort: Sort;
  sorts?: Sort[];
  query?: string;
  applied: number;
  curated?: CuratedTarget[];
}

// A plain GET form, so filtering works without JavaScript and every filter state is a URL;
// with JavaScript it applies as soon as something changes.
export function FilterForm({
  action,
  facets,
  sort,
  sorts = ['relevance', 'price-low', 'price-high', 'name'],
  query,
  applied,
  curated = [],
}: FilterFormProps) {
  return (
    <details className={styles.filters}>
      <summary className={styles.summary}>
        Filter and sort{applied > 0 && ` (${applied} applied)`}
      </summary>
      <form action={action} method="get" className={styles.form} id="filters">
        {query !== undefined && <input type="hidden" name="q" value={query} />}
        <label className={styles.sort}>
          Sort by
          <select name="sort" defaultValue={sort}>
            {sorts.map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        {facets.map((facet) => (
          <fieldset key={facet.id} className={styles.facet}>
            <legend>{facet.label}</legend>
            {facet.values.map((value) => (
              <label key={value.slug} className={styles.option}>
                <input
                  type="checkbox"
                  name={facet.id}
                  value={value.slug}
                  defaultChecked={value.selected}
                />
                <span>
                  {value.label} <span className={styles.count}>({value.count})</span>
                </span>
              </label>
            ))}
          </fieldset>
        ))}
        <button type="submit" className={styles.apply}>
          Show results
        </button>
        <ApplyOnChange formId="filters" curated={curated} />
      </form>
    </details>
  );
}
