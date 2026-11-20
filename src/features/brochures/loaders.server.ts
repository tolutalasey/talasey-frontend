import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { bySlug, contentOr } from '@/lib/content';
import { fallbackAcknowledgements } from './fallback-acknowledgements';
import { fallbackBrochures } from './fallback-brochures';
import {
  acknowledgementSchema,
  brochureSchema,
  type Acknowledgement,
  type Brochure,
} from './schemas';

export async function getBrochures(): Promise<Brochure[]> {
  'use cache';
  cacheTag(cacheTags.brochures);
  cacheLife('days');
  const brochures = await contentOr('brochure', brochureSchema, fallbackBrochures, bySlug);
  return [...brochures].sort((a, b) => a.edition - b.edition);
}

export async function getAcknowledgements(): Promise<Acknowledgement[]> {
  'use cache';
  cacheTag(cacheTags.acknowledgements);
  cacheLife('days');
  return contentOr('acknowledgement', acknowledgementSchema, fallbackAcknowledgements, bySlug);
}
