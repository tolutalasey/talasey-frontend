import type { Metadata } from 'next';
import { ProductList } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Products' };

interface Props {
  searchParams: Promise<{ search?: string; message?: string; error?: string }>;
}

export default async function Products({ searchParams }: Props) {
  const { search, message, error } = await searchParams;
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: products = [] } = await (
    await staffApi()
  ).GET('/admin/products', {
    params: { query: { search } },
  });
  return (
    <>
      <h1>Products</h1>
      <Notice message={message} error={error} />
      <ProductList products={products} search={search} />
    </>
  );
}
