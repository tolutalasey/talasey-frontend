import type { Metadata } from 'next';
import {
  getHubDocuments,
  getVideos,
  KnowledgeHub,
  parseHubFilters,
} from '@/features/knowledge-hub';
import { pageMetadata } from '@/lib/seo';

// Filters are links with query strings, so the page renders per request.
export const instant = false;

type Props = PageProps<'/knowledge-hub'>;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseHubFilters(await searchParams);
  return pageMetadata({
    title: 'Knowledge Hub: guides, data sheets and videos | Talasey',
    description:
      'Installation guides, specification and safety data sheets, declarations of performance and how-to videos for Talasey paving, decking and landscaping products.',
    path: '/knowledge-hub/',
    noindex: Boolean(filters.range || filters.kind || filters.query || filters.page > 1),
  });
}

export default async function KnowledgeHubPage({ searchParams }: Props) {
  const [filters, documents, videos] = await Promise.all([
    searchParams.then(parseHubFilters),
    getHubDocuments(),
    getVideos(),
  ]);
  return <KnowledgeHub documents={documents} videos={videos} filters={filters} />;
}
