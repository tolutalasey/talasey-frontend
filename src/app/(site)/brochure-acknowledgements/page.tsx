import type { Metadata } from 'next';
import {
  AcknowledgementsPage,
  getAcknowledgements,
  parseThanksFilters,
} from '@/features/brochures';
import { pageMetadata } from '@/lib/seo';

// Filters and pages are query strings, so the page renders per request.
export const instant = false;

type Props = PageProps<'/brochure-acknowledgements'>;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseThanksFilters(await searchParams);
  return pageMetadata({
    title: 'Brochure acknowledgements | Talasey',
    description:
      'The landscaping professionals whose photos of Talasey paving, decking and cladding appear in our brochures.',
    path: '/brochure-acknowledgements/',
    noindex: Boolean(filters.range || filters.page > 1),
  });
}

export default async function BrochureAcknowledgements({ searchParams }: Props) {
  const [filters, entries] = await Promise.all([
    searchParams.then(parseThanksFilters),
    getAcknowledgements(),
  ]);
  return <AcknowledgementsPage entries={entries} filters={filters} />;
}
