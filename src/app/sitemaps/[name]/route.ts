import { connection } from 'next/server';
import { getSitemap, SITEMAPS, type SitemapName } from '@/features/site-index';
import { urlSetXml, xmlResponse } from '@/lib/sitemap-xml';

const nameOf = (file: string) =>
  SITEMAPS.find((name) => `${name}.xml` === file) as SitemapName | undefined;

export async function GET(_request: Request, { params }: RouteContext<'/sitemaps/[name]'>) {
  await connection();
  const name = nameOf((await params).name);
  if (!name) return new Response('Not found', { status: 404 });
  return xmlResponse(urlSetXml(await getSitemap(name)));
}
