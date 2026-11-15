import { fallbackRanges, rangeGallery, rangePhoto, type Range } from '@/features/catalogue';
import {
  fallbackBrands,
  fallbackFaqs,
  fallbackGuides,
  fallbackProjects,
  type BrandPage,
  type ProjectPage,
} from '@/features/content';
import { fallbackHomeContent } from '@/features/home';
import { slugify } from '@/lib/slug';
import type { Data } from './fields';

// What the site shows today for pages nobody has saved in /content yet, in the shape the editor
// uses. Opening one of these starts its entry from what shoppers see now, ready to change.
export interface LiveEntry {
  key: string;
  title: string;
  data: Data;
}

const paragraphs = (lines: string[]) => lines.join('\n\n');

const pageData = ({ story, ...page }: BrandPage | ProjectPage): Data => ({
  ...page,
  story: paragraphs(story),
});

const rangeData = (range: Range): Data => {
  const top = rangePhoto(range.slug);
  return {
    name: range.name,
    slug: range.slug,
    kind: range.kind,
    h1: range.h1,
    intro: range.intro,
    photo: range.photo ?? { ...top, alt: range.name },
    gallery: range.gallery.length > 0 ? range.gallery : rangeGallery(range.slug),
    scope: {
      categories: range.scope.categories ?? [],
      titleIncludes: range.scope.titleIncludes ?? [],
    },
    buyingGuide: paragraphs(range.buyingGuide),
    faqs: range.faqs,
    curated: range.curated.map(({ filters, ...page }) => ({
      ...page,
      filters: Object.entries(filters).flatMap(([facet, values]) =>
        values.map((value) => ({ facet, value })),
      ),
    })),
    seo: range.seo,
  };
};

const LIVE: Record<string, () => LiveEntry[]> = {
  home: () => [{ key: 'home', title: 'Homepage', data: fallbackHomeContent }],
  'range-page': () =>
    fallbackRanges.map((range) => ({ key: range.slug, title: range.name, data: rangeData(range) })),
  'brand-page': () =>
    fallbackBrands.map((page) => ({ key: page.slug, title: page.name, data: pageData(page) })),
  'project-page': () =>
    fallbackProjects.map((page) => ({ key: page.slug, title: page.name, data: pageData(page) })),
  guide: () =>
    fallbackGuides.map(({ body, author, ...guide }) => ({
      key: guide.slug,
      title: guide.title,
      data: { ...guide, body: paragraphs(body), author: { name: author.name, role: author.role } },
    })),
  faq: () =>
    Object.entries(fallbackFaqs).flatMap(([topic, faqs]) =>
      faqs.map((faq) => ({
        key: slugify(faq.question),
        title: faq.question,
        data: { ...faq, topic, slug: slugify(faq.question) },
      })),
    ),
};

export const liveEntries = (type: string): LiveEntry[] => LIVE[type]?.() ?? [];

// The pages the site shows that have no entry in /content yet.
export const unsavedEntries = (type: string, savedKeys: string[]) =>
  liveEntries(type).filter((entry) => !savedKeys.includes(entry.key));
