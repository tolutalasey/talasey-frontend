import 'server-only';
import { getProductRow, getProductsByHandle, getRanges, type Range } from '@/features/catalogue';
import type { SearchRecord } from '@/features/search';
import { slugify } from '@/lib/slug';
import { filterInspiration, type InspirationFilters } from './inspiration';
import { getBrandPages, getGuides, getInspiration, getProjectPages } from './loaders.server';
import type { BrandPage, Guide, HelpTopic, ProjectPage } from './schemas';

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

export async function getInspirationView(filters: InspirationFilters) {
  return filterInspiration(await getInspiration(), filters);
}
