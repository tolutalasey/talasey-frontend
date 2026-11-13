import type { Metadata } from 'next';
import {
  getInspirationView,
  InspirationGallery,
  parseInspirationFilters,
} from '@/features/content';
import { pageMetadata } from '@/lib/seo';

// Filters are links with query strings, so the page renders per request.
export const instant = false;

type Props = PageProps<'/inspiration'>;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseInspirationFilters(await searchParams);
  const { shown } = await getInspirationView(filters);
  return pageMetadata({
    title: 'Garden inspiration from real projects | Talasey',
    description:
      'Photos of real gardens laid with Talasey paving, decking, screens and lighting, filtered by product, colour, style and space.',
    path: '/inspiration/',
    noindex: Object.keys(filters).length > 0 || shown.length === 0,
  });
}

export default async function Inspiration({ searchParams }: Props) {
  const filters = parseInspirationFilters(await searchParams);
  return <InspirationGallery {...await getInspirationView(filters)} filters={filters} />;
}
