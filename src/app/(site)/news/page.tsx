import type { Metadata } from 'next';
import { getNewsPosts, NewsPage, parseNewsFilters } from '@/features/news';
import { pageMetadata } from '@/lib/seo';

// Categories and pages are query strings, so the page renders per request.
export const instant = false;

type Props = PageProps<'/news'>;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseNewsFilters(await searchParams);
  return pageMetadata({
    title: 'News & blogs | Talasey',
    description:
      'Talasey news, awards, events, case studies and landscaping advice for paving, decking and outdoor spaces.',
    path: '/news/',
    noindex: Boolean(filters.category || filters.page > 1),
  });
}

export default async function News({ searchParams }: Props) {
  const [filters, posts] = await Promise.all([searchParams.then(parseNewsFilters), getNewsPosts()]);
  return <NewsPage posts={posts} filters={filters} />;
}
