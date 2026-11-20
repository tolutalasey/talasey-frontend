import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import { defaultNavigation, defaultSiteSettings } from './default-navigation';
import {
  parseNavigation,
  parseSiteSettings,
  type Navigation,
  type SiteSettings,
} from './navigation';

export async function getNavigation(): Promise<Navigation> {
  'use cache';
  cacheTag(cacheTags.navigation);
  cacheLife('days');
  const [published] = await publishedContent('navigation');
  const parsed = parseNavigation(published);
  return parsed.success ? parsed.data : defaultNavigation;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  'use cache';
  cacheTag(cacheTags.siteSettings);
  cacheLife('days');
  const [published] = await publishedContent('site-settings');
  const parsed = parseSiteSettings(published);
  return parsed.success ? { ...defaultSiteSettings, ...parsed.data } : defaultSiteSettings;
}
