import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { getFeaturedProducts, getRanges } from '@/features/catalogue';
import { getHomeContent, getLatestNews, HomePage, seasonalBlockFor } from '@/features/home';
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
  const [content, now, ranges, news] = await Promise.all([
    getHomeContent(),
    today(),
    getRanges(),
    getLatestNews(),
  ]);
  const featured = await getFeaturedProducts(content.products);
  return (
    <HomePage
      content={content}
      season={seasonalBlockFor(content, now)}
      featured={featured}
      news={news}
      rangeNames={ranges.map((range) => range.name)}
    />
  );
}
