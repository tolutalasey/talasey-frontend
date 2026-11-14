import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokePricing, formFromConfig } from '@/features/admin';
import { NotAllowed, PageHeader, requireStaff, staffApi } from '@/features/staff';

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
      <PageHeader
        back={{ href: `/admin/products/${id}/`, label: product.title }}
        eyebrow="Made-to-measure pricing"
        title={product.title}
        description="The sizes shoppers can order, the price formula, and a calculator to test it."
      />
      <BespokePricing productId={id} values={formFromConfig(product.bespoke)} />
    </>
  );
}
