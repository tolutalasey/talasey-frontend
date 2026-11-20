import type { Metadata } from 'next';
import { LocalHelpPage } from '@/features/contact';
import { getProduct } from '@/features/product';
import { pageMetadata } from '@/lib/seo';

// The product asked about comes from the address, so the page renders per request.
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Find a Talasey stockist near you | Talasey',
  description:
    'Tell us your postcode and we will email you the Talasey stockists nearest to you, for paving, decking and landscaping products.',
  path: '/find-a-stockist/',
});

type Props = PageProps<'/find-a-stockist'>;

export default async function FindAStockist({ searchParams }: Props) {
  const { product: handle } = await searchParams;
  const product = typeof handle === 'string' ? await getProduct(handle) : null;
  return (
    <LocalHelpPage
      kind="stockist"
      product={product && { handle: product.handle, title: product.title }}
    />
  );
}
