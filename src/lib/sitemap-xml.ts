export interface SitemapEntry {
  url: string;
  lastModified?: string | null;
}

const escapeXml = (text: string) =>
  text.replace(
    /[<>&'"]/g,
    (char) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[char]};`,
  );

const lastmod = (date: string | null | undefined) =>
  date ? `<lastmod>${escapeXml(date)}</lastmod>` : '';

export function urlSetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => `<url><loc>${escapeXml(entry.url)}</loc>${lastmod(entry.lastModified)}</url>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function sitemapIndexXml(entries: SitemapEntry[]): string {
  const maps = entries
    .map(
      (entry) =>
        `<sitemap><loc>${escapeXml(entry.url)}</loc>${lastmod(entry.lastModified)}</sitemap>`,
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${maps}</sitemapindex>`;
}

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });

// The newest of a set of dates, for a sitemap or a range made of many products.
export function latest(dates: (string | null | undefined)[]): string | null {
  const known = dates.filter((date): date is string => Boolean(date)).sort();
  return known.at(-1) ?? null;
}
