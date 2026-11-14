import type { Metadata } from 'next';
import { createProduct, PRODUCT_VIEWS, ProductList, type ProductView } from '@/features/admin';
import {
  CreateMenu,
  NotAllowed,
  Notice,
  PageHeader,
  requireStaff,
  staffApi,
} from '@/features/staff';
import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';

export const metadata: Metadata = { title: 'Products' };

interface Props {
  searchParams: Promise<{
    search?: string;
    show?: string;
    page?: string;
    message?: string;
    error?: string;
  }>;
}

export default async function Products({ searchParams }: Props) {
  const { search, show, page, message, error } = await searchParams;
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const view: ProductView = show && show in PRODUCT_VIEWS ? (show as ProductView) : 'all';
  const { data: products = [] } = await (
    await staffApi()
  ).GET('/admin/products', {
    params: { query: { search } },
  });
  return (
    <>
      <PageHeader
        title="Products"
        description="Everything on the shop. Hidden products stay off the shop until you show them."
        actions={
          <CreateMenu label="Add product">
            <form action={createProduct}>
              <TextField label="Product name" name="title" isRequired autoFocus />
              <Button type="submit">Create and edit</Button>
            </form>
          </CreateMenu>
        }
      />
      <Notice message={message} error={error} />
      <ProductList products={products} view={view} search={search} page={page} />
    </>
  );
}
