import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGuides, getGuideView, GuidePage, guidePath } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/guides/[guide]'>;

export async function generateStaticParams() {
  return (await getGuides()).map((guide) => ({ guide: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const view = await getGuideView((await params).guide);
  if (!view) notFound();
  return pageMetadata({
    ...view.guide.seo,
    path: guidePath(view.guide),
    noindex: view.guide.placeholder,
  });
}

export default async function Guide({ params }: Props) {
  const view = await getGuideView((await params).guide);
  if (!view) notFound();
  return <GuidePage {...view} />;
}
