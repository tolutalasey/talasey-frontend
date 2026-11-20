import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { bySlug, contentOr } from '@/lib/content';
import { fallbackDocuments } from './fallback-documents';
import { fallbackVideos } from './fallback-videos';
import {
  hubDocumentSchema,
  videoSchema,
  type DocumentRange,
  type HubDocument,
  type Video,
} from './schemas';

const wordsOf = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  );

// A short product address like pavetuf-deep-cleaner is named by "Pavetuf Deep Cleaner Guide".
const titleNames = (title: string, handle: string) => {
  const wanted = handle.split('-');
  const words = wordsOf(title);
  return wanted.length >= 2 && wanted.length <= 4 && wanted.every((word) => words.has(word));
};

const newestFirst = <T extends { publishedOn: string; title: string }>(entries: T[]) =>
  [...entries].sort(
    (a, b) => b.publishedOn.localeCompare(a.publishedOn) || a.title.localeCompare(b.title),
  );

export async function getHubDocuments(): Promise<HubDocument[]> {
  'use cache';
  cacheTag(cacheTags.hubDocuments);
  cacheLife('days');
  return newestFirst(await contentOr('hub-document', hubDocumentSchema, fallbackDocuments, bySlug));
}

export async function getVideos(): Promise<Video[]> {
  'use cache';
  cacheTag(cacheTags.videos);
  cacheLife('days');
  return newestFirst(await contentOr('video', videoSchema, fallbackVideos, bySlug));
}

// What to show on a product page: entries linked to the product by its web address, or, for
// entries not linked to any product, ones whose title names it.
export async function getProductResources(handle: string) {
  const [documents, videos] = await Promise.all([getHubDocuments(), getVideos()]);
  const about = (entry: { title: string; products: string[] }) =>
    entry.products.length > 0 ? entry.products.includes(handle) : titleNames(entry.title, handle);
  return { documents: documents.filter(about), videos: videos.filter(about) };
}

// A video with documents and other videos for the same product ranges.
export async function getVideoView(slug: string) {
  const [videos, documents] = await Promise.all([getVideos(), getHubDocuments()]);
  const video = videos.find((entry) => entry.slug === slug);
  if (!video) return null;
  const shares = (entry: { ranges: DocumentRange[] }) =>
    entry.ranges.some((range) => video.ranges.includes(range));
  return {
    video,
    documents: documents.filter(shares).slice(0, 4),
    more: videos.filter((entry) => entry !== video && shares(entry)).slice(0, 4),
  };
}
