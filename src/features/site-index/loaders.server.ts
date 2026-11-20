import 'server-only';
import {
  curatedPath,
  getRanges,
  getRangeListing,
  rangePath,
  type Range,
} from '@/features/catalogue';
import {
  brandPagePath,
  getBrandPages,
  getGuides,
  getInspiration,
  getProjectPages,
  guidePath,
  HELP_TOPICS,
  helpPath,
  projectPath,
} from '@/features/content';
import { getVideos, videoPath } from '@/features/knowledge-hub';
import { getNewsPosts, newsPostPath } from '@/features/news';
import { getPlainPages, plainPagePath } from '@/features/pages';
import { getSearchRecords, searchProducts } from '@/features/search';
import { latest, type SitemapEntry } from '@/lib/sitemap-xml';
import { absoluteUrl } from '@/lib/site';
import { colourPath } from '@/lib/product-colours';
import { productPath } from '@/lib/urls/keyword-map';

export const SITEMAPS = ['products', 'ranges', 'guides', 'inspiration', 'pages'] as const;
export type SitemapName = (typeof SITEMAPS)[number];

const entry = (path: string, lastModified?: string | null): SitemapEntry => ({
  url: absoluteUrl(path),
  lastModified,
});

async function productEntries(): Promise<SitemapEntry[]> {
  return (await getSearchRecords()).flatMap((record) => [
    entry(productPath(record.handle), record.updatedAt),
    ...record.colours.map((colour) =>
      entry(colourPath(record.handle, colour.name), record.updatedAt),
    ),
  ]);
}

// A range is listed once it sells something; a curated page once its filter finds something.
// Each is dated by its most recently changed product.
async function rangeEntries(): Promise<SitemapEntry[]> {
  const ranges = await getRanges();
  const listed = await Promise.all(
    ranges.map(async (range: Range) => {
      const { hits } = await searchProducts({ scope: range.scope, pageSize: 1000 });
      if (hits.length === 0) return [];
      const curated = await Promise.all(
        range.curated.map(async (page) => {
          const listing = await getRangeListing(
            range,
            { filters: {}, sort: undefined, page: 1 },
            page,
          );
          return listing.result.total > 0
            ? [
                entry(
                  curatedPath(range, page),
                  latest(listing.result.hits.map((hit) => hit.updatedAt)),
                ),
              ]
            : [];
        }),
      );
      return [entry(rangePath(range), latest(hits.map((hit) => hit.updatedAt))), ...curated.flat()];
    }),
  );
  return listed.flat();
}

async function guideEntries(): Promise<SitemapEntry[]> {
  const [guides, videos, posts] = await Promise.all([getGuides(), getVideos(), getNewsPosts()]);
  return [
    entry('/news/', posts[0]?.publishedOn),
    ...posts.map((post) => entry(newsPostPath(post), post.publishedOn)),
    ...guides
      .filter((guide) => !guide.placeholder)
      .map((guide) => entry(guidePath(guide), guide.reviewedOn ?? guide.publishedOn)),
    entry('/knowledge-hub/'),
    entry('/videos/', latest(videos.map((video) => video.publishedOn))),
    ...videos.map((video) => entry(videoPath(video), video.publishedOn)),
  ];
}

async function inspirationEntries(): Promise<SitemapEntry[]> {
  return (await getInspiration()).length > 0 ? [entry('/inspiration/')] : [];
}

// Pages with no reliable date leave lastmod out rather than claim one.
async function pageEntries(): Promise<SitemapEntry[]> {
  const [brands, projects, plainPages] = await Promise.all([
    getBrandPages(),
    getProjectPages(),
    getPlainPages(),
  ]);
  return [
    entry('/'),
    entry('/brands/'),
    ...brands.filter((page) => !page.placeholder).map((page) => entry(brandPagePath(page))),
    entry('/projects/'),
    ...projects.filter((page) => !page.placeholder).map((page) => entry(projectPath(page))),
    entry('/guides/'),
    entry('/help/'),
    ...HELP_TOPICS.map((topic) => entry(helpPath(topic))),
    entry('/samples/'),
    entry('/product-finder/'),
    entry('/contact/'),
    entry('/brochures/'),
    entry('/brochure-acknowledgements/'),
    entry('/find-a-stockist/'),
    entry('/find-an-installer/'),
    entry('/book-a-showroom-visit/'),
    ...plainPages.filter((page) => !page.placeholder).map((page) => entry(plainPagePath(page))),
  ];
}

const LOADERS: Record<SitemapName, () => Promise<SitemapEntry[]>> = {
  products: productEntries,
  ranges: rangeEntries,
  guides: guideEntries,
  inspiration: inspirationEntries,
  pages: pageEntries,
};

export async function getSitemap(name: SitemapName): Promise<SitemapEntry[]> {
  return LOADERS[name]();
}

export const sitemapPath = (name: SitemapName) => `/sitemaps/${name}.xml`;
