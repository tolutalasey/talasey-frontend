import 'server-only';
import { getProductRow, getProductsByHandle, getRanges, type Range } from '@/features/catalogue';
import type { SearchRecord } from '@/features/search';
import { slugify } from '@/lib/slug';
import { filterInspiration, type InspirationFilters } from './inspiration';
import { getBrandPages, getGuides, getInspiration, getProjectPages } from './loaders.server';
import type { BrandPage, Guide, HelpTopic, Inspiration, ProjectPage } from './schemas';
import { productPath } from '@/lib/urls/keyword-map';

const ROW = 12;

async function rangesFor(slugs: string[]): Promise<Range[]> {
  const ranges = await getRanges();
  return slugs.flatMap((slug) => ranges.filter((range) => range.slug === slug));
}

export async function getBrandView(slug: string) {
  const page = (await getBrandPages()).find((brand) => brand.slug === slug);
  return page ? brandViewFor(page) : null;
}

export async function brandViewFor(page: BrandPage) {
  const [ranges, products] = await Promise.all([
    rangesFor(page.ranges),
    getProductRow({ filters: { brand: [slugify(page.name)] }, pageSize: ROW }),
  ]);
  return { page, ranges, products };
}

export async function getProjectView(slug: string) {
  const page = (await getProjectPages()).find((project) => project.slug === slug);
  return page ? projectViewFor(page) : null;
}

export async function projectViewFor(page: ProjectPage) {
  const ranges = await rangesFor(page.ranges);
  const products = await getProductRow({
    scope: {
      categories: ranges.flatMap((range) => range.scope.categories ?? []),
      titleIncludes: ranges.flatMap((range) => range.scope.titleIncludes ?? []),
    },
    sort: 'price-low',
    pageSize: ROW,
  });
  return { page, ranges, products };
}

export async function getGuideView(
  slug: string,
): Promise<{ guide: Guide; products: SearchRecord[] } | null> {
  const guide = (await getGuides()).find((candidate) => candidate.slug === slug);
  return guide ? guideViewFor(guide) : null;
}

export async function guideViewFor(guide: Guide) {
  return { guide, products: await getProductsByHandle(guide.products) };
}

const GUIDE_TOPIC_FOR_HELP: Record<string, Guide['topic']> = {
  laying: 'Laying',
  care: 'Care',
};

export async function getHelpGuides(topic: HelpTopic): Promise<Guide[]> {
  const guideTopic = GUIDE_TOPIC_FOR_HELP[topic.slug];
  return guideTopic ? (await getGuides()).filter((guide) => guide.topic === guideTopic) : [];
}

const SHOWN_ON_PRODUCT = 6;

// Staff paste a product's web address or just its handle; either names the product.
const handleOf = (address: string) => address.trim().split('/').filter(Boolean).pop() ?? '';

export interface GalleryPhoto extends Inspiration {
  productLinks: { title: string; href: string }[];
}

async function withProductLinks(items: Inspiration[]): Promise<GalleryPhoto[]> {
  const handles = [...new Set(items.flatMap((item) => item.products.map(handleOf)))];
  const records = new Map(
    (await getProductsByHandle(handles)).map((record) => [record.handle, record]),
  );
  return items.map((item) => ({
    ...item,
    productLinks: item.products.flatMap((address) => {
      const record = records.get(handleOf(address));
      return record ? [{ title: record.title, href: productPath(record.handle) }] : [];
    }),
  }));
}

// Gallery photos that show this product, for the "in real gardens" strip on its page.
export async function getInspirationFor(handle: string): Promise<GalleryPhoto[]> {
  const showing = (await getInspiration()).filter((item) =>
    item.products.some((address) => handleOf(address) === handle),
  );
  return withProductLinks(showing.slice(0, SHOWN_ON_PRODUCT));
}

export async function getInspirationView(filters: InspirationFilters) {
  const { shown, facets } = filterInspiration(await getInspiration(), filters);
  return { shown: await withProductLinks(shown), facets };
}
