import { Button } from '@/ui/Button/Button';
import { Table } from '@/ui/Table/Table';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import { money, staffStyles as styles } from '@/features/staff';
import { createProduct } from '../actions';
import type { ProductSummary } from '../types';

interface Props {
  products: ProductSummary[];
  search?: string;
}

export function ProductList({ products, search }: Props) {
  return (
    <>
      <div className={styles.row}>
        <form method="get" className={styles.row} role="search">
          <TextField
            label="Find a product"
            name="search"
            defaultValue={search}
            description="Name, web address or SKU"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <form action={createProduct} className={styles.row}>
          <TextField label="New product name" name="title" isRequired />
          <Button type="submit">Add product</Button>
        </form>
      </div>
      <Table caption={`${products.length} products`}>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Price from</th>
            <th scope="col">Options</th>
            <th scope="col">Page type</th>
            <th scope="col">On the shop</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <th scope="row">
                <NextLink href={`/admin/products/${product.id}/`}>{product.title}</NextLink>
              </th>
              <td>
                {product.priceFromPence === null ? 'No price' : money(product.priceFromPence)}
              </td>
              <td>
                {product.variantCount}
                {product.unpriced > 0 && (
                  <span className={styles.muted}> ({product.unpriced} without a price)</span>
                )}
              </td>
              <td>{product.pageType ?? 'Not set up'}</td>
              <td>{product.published ? 'Published' : 'Hidden'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
