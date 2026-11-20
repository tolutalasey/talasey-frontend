import type { Metadata } from 'next';
import { LocalHelpPage } from '@/features/contact';
import { getProduct } from '@/features/product';
import { pageMetadata } from '@/lib/seo';

// The product asked about comes from the address, so the page renders per request.
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Find an approved installer | Talasey',
  description:
    'Tell us about your project and we will put you in touch with an approved Talasey installer near you, for paving, decking and pergolas.',
  path: '/find-an-installer/',
});

type Props = PageProps<'/find-an-installer'>;

export default async function FindAnInstaller({ searchParams }: Props) {
  const { product: handle } = await searchParams;
  const product = typeof handle === 'string' ? await getProduct(handle) : null;
  return (
    <LocalHelpPage
      kind="installer"
      product={product && { handle: product.handle, title: product.title }}
    />
  );
}
