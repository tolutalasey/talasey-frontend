import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { getProductsByHandle, getRanges } from '@/features/catalogue';
import { getHomeContent, HomePage, seasonalBlockFor } from '@/features/home';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  return pageMetadata({ ...seo, path: '/' });
}

async function today() {
  'use cache';
  cacheLife('days');
  return new Date();
}

export default async function Home() {
  const [content, now, ranges] = await Promise.all([getHomeContent(), today(), getRanges()]);
  const featured = await getProductsByHandle(content.products);
  return (
    <HomePage
      content={content}
      season={seasonalBlockFor(content, now)}
      featured={featured}
      rangeNames={ranges.map((range) => range.name)}
    />
  );
}
