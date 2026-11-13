import styles from './Content.module.css';

// A plain GET form to the search page, for the help centre and the 404 page.
export function SearchBox({ label = 'Search products and help' }: { label?: string }) {
  return (
    <form action="/search/" method="get" role="search" className={styles.search}>
      <label>
        {label}
        <input type="search" name="q" autoComplete="off" />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
