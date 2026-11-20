import type { Metadata } from 'next';
import { getAllFaqs, HelpCentre, searchFaqs } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

// The question search is a query string, so the page renders per request.
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Help centre: questions and answers | Talasey',
  description:
    'Answers on natural stone, porcelain, composite decking, artificial grass, laying, cleaning, delivery, returns and samples, and how to get in touch.',
  path: '/help/',
});

type Props = PageProps<'/help'>;

export default async function Help({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (typeof q === 'string' ? q : '').trim().slice(0, 100);
  const groups = await getAllFaqs();
  return (
    <HelpCentre
      query={query}
      hits={query ? searchFaqs(groups, query) : []}
      counts={Object.fromEntries(groups.map(({ topic, faqs }) => [topic.slug, faqs.length]))}
    />
  );
}
