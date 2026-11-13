import type { Metadata } from 'next';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { BespokePricing, formFromConfig } from '@/features/admin';
import { NotAllowed, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Made-to-measure pricing' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BespokePricingPage({ params }: Props) {
  const { id } = await params;
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: product } = await (
    await staffApi()
  ).GET('/admin/products/{id}', { params: { path: { id } } });
  if (!product) notFound();
  return (
    <>
      <p>
        <NextLink href={`/admin/products/${id}/`}>Back to {product.title}</NextLink>
      </p>
      <h1>Made-to-measure pricing: {product.title}</h1>
      <BespokePricing productId={id} values={formFromConfig(product.bespoke)} />
    </>
  );
}
