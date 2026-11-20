import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideos, getVideoView, videoPath, VideoPage } from '@/features/knowledge-hub';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/videos/[video]'>;

export async function generateStaticParams() {
  return (await getVideos()).map((video) => ({ video: video.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const view = await getVideoView((await params).video);
  if (!view) notFound();
  return pageMetadata({
    title: `${view.video.title} | Talasey`.slice(0, 60),
    description: (
      view.video.summary ?? `Watch ${view.video.title}, from Talasey's technical team.`
    ).slice(0, 160),
    path: videoPath(view.video),
  });
}

export default async function Video({ params }: Props) {
  const view = await getVideoView((await params).video);
  if (!view) notFound();
  return <VideoPage {...view} />;
}
