import type { Metadata } from 'next';
import { getVideos, VideoLibrary } from '@/features/knowledge-hub';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'How-to videos for paving, decking and cladding | Talasey',
  description:
    'Watch how to install composite cladding and fencing, use Pavetuf cleaners and jointing, and get the best from Talasey products.',
  path: '/videos/',
});

export default async function Videos() {
  return <VideoLibrary videos={await getVideos()} />;
}
