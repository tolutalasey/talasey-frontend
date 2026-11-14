import 'server-only';
import type { SampleOffer } from '@/api-client';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { getSamplesClient, orEmpty } from '@/lib/commerce';

export async function getSampleOffers(): Promise<SampleOffer[]> {
  'use cache';
  cacheTag(cacheTags.samples);
  const offers = await orEmpty(() => getSamplesClient().offers());
  // An empty list may only mean the API was not reachable (during a build, say): keep it briefly.
  if (offers.length > 0) cacheLife('hours');
  else cacheLife('seconds');
  return offers;
}

export async function getProductSampleOffers(handle: string): Promise<SampleOffer[]> {
  return (await getSampleOffers()).filter((offer) => offer.productHandle === handle);
}
