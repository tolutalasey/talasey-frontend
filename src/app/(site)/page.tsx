import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { getProductsByHandle } from '@/features/catalogue';
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
  const [content, now] = await Promise.all([getHomeContent(), today()]);
  const featured = await getProductsByHandle(content.products);
  return <HomePage content={content} season={seasonalBlockFor(content, now)} featured={featured} />;
}
