import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductEditor } from '@/features/admin';
import { Badge, NotAllowed, Notice, PageHeader, requireStaff, staffApi } from '@/features/staff';

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
      <PageHeader
        back={{ href: '/admin/products/', label: 'Products' }}
        title={product.title}
        meta={
          <>
            <Badge tone={product.published ? 'good' : 'neutral'}>
              {product.published ? 'On the shop' : 'Hidden'}
            </Badge>
            {product.problems.length > 0 && (
              <Badge tone="warn">
                {product.problems.length} SKU {product.problems.length === 1 ? 'check' : 'checks'}
              </Badge>
            )}
            <span>/products/{product.handle}/</span>
          </>
        }
      />
      <Notice message={message} error={error} />
      <ProductEditor product={product} categories={categories} colourSets={colourSets} />
    </>
  );
}
