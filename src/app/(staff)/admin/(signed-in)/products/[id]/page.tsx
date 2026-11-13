import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductEditor } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Edit product' };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function EditProduct({ params, searchParams }: Props) {
  const [{ id }, { message, error }] = await Promise.all([params, searchParams]);
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const api = await staffApi();
  const [{ data: product }, { data: categories = [] }, { data: colourSets = [] }] =
    await Promise.all([
      api.GET('/admin/products/{id}', { params: { path: { id } } }),
      api.GET('/admin/categories'),
      api.GET('/admin/colour-sets'),
    ]);
  if (!product) notFound();
  return (
    <>
      <h1>{product.title}</h1>
      <Notice message={message} error={error} />
      <ProductEditor product={product} categories={categories} colourSets={colourSets} />
    </>
  );
}
