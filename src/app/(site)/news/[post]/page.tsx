import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsPosts, getNewsPostView, NewsArticle, newsPostPath } from '@/features/news';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/news/[post]'>;

export async function generateStaticParams() {
  return (await getNewsPosts()).map((post) => ({ post: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const view = await getNewsPostView((await params).post);
  if (!view) notFound();
  return pageMetadata({
    title: `${view.post.title} | Talasey`,
    description: view.post.excerpt.replace(/…$/, '').slice(0, 160),
    path: newsPostPath(view.post),
    image: view.post.photo?.src,
  });
}

export default async function NewsPost({ params }: Props) {
  const view = await getNewsPostView((await params).post);
  if (!view) notFound();
  return <NewsArticle {...view} />;
}
