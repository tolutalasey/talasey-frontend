import type { Metadata } from 'next';
import { getGuides, GuidesHub } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Garden guides and advice | Talasey',
  description:
    'Guides to planning, buying, laying and looking after patios, decking, screens and more, with the products to use.',
  path: '/guides/',
});

export default async function Guides() {
  return <GuidesHub guides={await getGuides()} />;
}
