import type { Metadata } from 'next';
import { LocalHelpPage } from '@/features/contact';
import { getProduct } from '@/features/product';
import { pageMetadata } from '@/lib/seo';

// The product asked about comes from the address, so the page renders per request.
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Book a showroom visit | Talasey',
  description:
    'See and touch Talasey paving, decking and outdoor living products before you buy. Request a showroom visit and we will confirm it.',
  path: '/book-a-showroom-visit/',
});

type Props = PageProps<'/book-a-showroom-visit'>;

export default async function BookAShowroomVisit({ searchParams }: Props) {
  const { product: handle } = await searchParams;
  const product = typeof handle === 'string' ? await getProduct(handle) : null;
  return (
    <LocalHelpPage
      kind="showroom"
      product={product && { handle: product.handle, title: product.title }}
    />
  );
}
