import { connection } from 'next/server';
import { getSitemap, SITEMAPS, sitemapPath } from '@/features/site-index';
import { latest, sitemapIndexXml, xmlResponse } from '@/lib/sitemap-xml';
import { absoluteUrl } from '@/lib/site';

// PRD section 13: sitemaps split by type, listing only types that have pages.
export async function GET() {
  await connection();
  const maps = await Promise.all(
    SITEMAPS.map(async (name) => ({ name, entries: await getSitemap(name) })),
  );
  return xmlResponse(
    sitemapIndexXml(
      maps
        .filter(({ entries }) => entries.length > 0)
        .map(({ name, entries }) => ({
          url: absoluteUrl(sitemapPath(name)),
          lastModified: latest(entries.map((entry) => entry.lastModified)),
        })),
    ),
  );
}
