import 'server-only';
import { getRanges, rangePath } from '@/features/catalogue';
import { getGuides, guidePath } from '@/features/content';
import { getHubDocuments, getVideos, videoPath } from '@/features/knowledge-hub';
import { getPlainPages, plainPagePath } from '@/features/pages';
import { searchContent, type ContentEntry } from './content-search';

async function contentEntries(): Promise<ContentEntry[]> {
  const [ranges, documents, videos, guides, pages] = await Promise.all([
    getRanges(),
    getHubDocuments(),
    getVideos(),
    getGuides(),
    getPlainPages(),
  ]);
  return [
    ...ranges.map((range) => ({
      kind: 'range' as const,
      title: range.name,
      text: range.intro,
      href: rangePath(range),
    })),
    ...documents.map((entry) => ({
      kind: 'document' as const,
      title: entry.title,
      text: `${entry.kind} ${entry.ranges.join(' ')}`,
      href: entry.file,
      label: entry.kind,
    })),
    ...videos.map((video) => ({
      kind: 'video' as const,
      title: video.title,
      text: `${video.summary ?? ''} ${video.ranges.join(' ')}`,
      href: videoPath(video),
    })),
    ...guides
      .filter((guide) => !guide.placeholder)
      .map((guide) => ({
        kind: 'guide' as const,
        title: guide.title,
        text: guide.answer,
        href: guidePath(guide),
        label: guide.topic,
      })),
    ...pages
      .filter((page) => !page.placeholder)
      .map((page) => ({
        kind: 'page' as const,
        title: page.title,
        text: page.intro ?? '',
        href: plainPagePath(page),
      })),
  ];
}

export async function searchSite(query: string) {
  return searchContent(await contentEntries(), query);
}
