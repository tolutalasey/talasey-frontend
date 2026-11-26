import NextLink from 'next/link';
import {
  Badge,
  EmptyState,
  ImageIcon,
  money,
  Pager,
  pageOf,
  ProductsIcon,
  RowActions,
  SearchIcon,
  staffStyles as styles,
} from '@/features/staff';
import { deleteProduct } from '../actions';
import { pageTypeName, type ProductSummary } from '../types';

export type ProductView = 'all' | 'live' | 'hidden' | 'unpriced';

export const PRODUCT_VIEWS: Record<
  ProductView,
  { label: string; keep: (product: ProductSummary) => boolean }
> = {
  all: { label: 'All', keep: () => true },
  live: { label: 'On the shop', keep: (product) => product.published },
  hidden: { label: 'Hidden', keep: (product) => !product.published },
  unpriced: { label: 'Missing prices', keep: (product) => product.unpriced > 0 },
};

interface Props {
  products: ProductSummary[];
  view: ProductView;
  search?: string;
  page?: string;
}

const PAGE_SIZE = 40;

const updated = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  }).format(new Date(iso));

export function ProductList({ products, view, search, page: pageParam }: Props) {
  const matching = products.filter(PRODUCT_VIEWS[view].keep);
  const page = pageOf(pageParam, matching.length, PAGE_SIZE);
  const shown = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (next: ProductView, nextPage = 1) => {
    const params = new URLSearchParams({
      ...(next !== 'all' && { show: next }),
      ...(search && { search }),
      ...(nextPage > 1 && { page: String(nextPage) }),
    });
    return `/admin/products/${params.size ? `?${params}` : ''}`;
  };

  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-label="Products">
      <div className={styles.toolbar}>
        <nav aria-label="Show" className={styles.tabs}>
          {(Object.keys(PRODUCT_VIEWS) as ProductView[]).map((key) => (
            <NextLink key={key} href={href(key)} aria-current={key === view ? 'page' : undefined}>
              {PRODUCT_VIEWS[key].label}
              <span className={styles.tabCount}>
                {products.filter(PRODUCT_VIEWS[key].keep).length}
              </span>
            </NextLink>
          ))}
        </nav>
        <form method="get" role="search" className={styles.search}>
          {view !== 'all' && <input type="hidden" name="show" value={view} />}
          <SearchIcon />
          <input
            name="search"
            defaultValue={search}
            placeholder="Name, web address or SKU"
            aria-label="Find a product"
          />
        </form>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={search ? <SearchIcon /> : <ProductsIcon />}
          title={search ? 'No products match' : 'Nothing here yet'}
        >
          {search
            ? 'Check the spelling, or search by SKU instead.'
            : 'Add a product with the button at the top of the page.'}
        </EmptyState>
      ) : (
        <ul className={styles.list}>
          {shown.map((product) => (
            <li key={product.id} className={styles.listRow}>
              {product.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element -- staff thumbnails, never on the shop
                <img src={product.thumbnail} alt="" className={styles.thumb} />
              ) : (
                <span className={styles.thumb}>
                  <ImageIcon />
                </span>
              )}
              <span className={styles.listMain}>
                <NextLink href={`/admin/products/${product.id}/`} className={styles.listTitle}>
                  {product.title}
                </NextLink>
                <span className={styles.listSub}>
                  {product.variantCount} {product.variantCount === 1 ? 'option' : 'options'}
                  {` · ${pageTypeName(product.pageType)}`} · Updated {updated(product.updatedAt)}
                </span>
              </span>
              <span className={styles.listEnd}>
                {product.unpriced > 0 && <Badge tone="warn">{product.unpriced} unpriced</Badge>}
                <Badge tone={product.published ? 'good' : 'neutral'}>
                  {product.published ? 'On the shop' : 'Hidden'}
                </Badge>
                <span className={styles.money}>
                  {product.priceFromPence === null ? '—' : `from ${money(product.priceFromPence)}`}
                </span>
                <RowActions
                  name={product.title}
                  editHref={`/admin/products/${product.id}/`}
                  remove={deleteProduct}
                  fields={{ id: product.id, confirm: 'on' }}
                />
              </span>
            </li>
          ))}
        </ul>
      )}
      <Pager
        page={page}
        pageSize={PAGE_SIZE}
        total={matching.length}
        href={(next) => href(view, next)}
      />
    </section>
  );
}
