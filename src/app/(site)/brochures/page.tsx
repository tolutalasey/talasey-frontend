import type { Metadata } from 'next';
import { BrochuresPage, getBrochures } from '@/features/brochures';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Brochures: paving, decking and pergolas | Talasey',
  description:
    'View and download Talasey brochures for porcelain and natural stone paving, composite decking, artificial grass, pergolas, lighting and more.',
  path: '/brochures/',
});

export default async function Brochures() {
  return <BrochuresPage brochures={await getBrochures()} />;
}
