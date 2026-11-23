import {
  fallbackRanges,
  rangeGallery,
  rangePhoto,
  withCurrentSiteWords,
  type Range,
} from '@/features/catalogue';
import {
  fallbackBrands,
  fallbackFaqs,
  fallbackGuides,
  fallbackProjects,
  type BrandPage,
  type ProjectPage,
} from '@/features/content';
import { fallbackHomeContent, heroScenes, tilePhoto } from '@/features/home';
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

const rangeData = (fallback: Range): Data => {
  const range = withCurrentSiteWords(fallback);
  const top = rangePhoto(range.slug);
  return {
    name: range.name,
    slug: range.slug,
    kind: range.kind,
    h1: range.h1,
    intro: range.intro,
    description: range.description ?? '',
    slides: (range.slides ?? []).map((photo) => ({ photo })),
    closing: range.closing ?? '',
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

interface SitePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const plainPhoto = ({ src, alt, width, height }: SitePhoto) => ({ src, alt, width, height });
const listOf = (value: unknown): Data[] => (Array.isArray(value) ? (value as Data[]) : []);
const text = (value: unknown) => (typeof value === 'string' ? value : '');
const withTilePhoto = (tile: Data): Data =>
  tile.photo
    ? tile
    : {
        ...tile,
        photo: tilePhoto({ photo: null, href: text(tile.href), title: text(tile.title) }),
      };
const isEmptyList = (value: unknown) => !Array.isArray(value) || value.length === 0;

// Photos the site draws from the brochures when an entry has none of its own, so the editor
// shows the photo that is really on the page and it can be clicked and changed.
const PHOTO_DEFAULTS: Record<string, (data: Data) => Data> = {
  home: (data) => ({
    ...data,
    heroScenes: isEmptyList(data.heroScenes)
      ? heroScenes.map(({ photo, ...scene }) => ({ ...scene, photo: plainPhoto(photo) }))
      : data.heroScenes,
    projectTiles: listOf(data.projectTiles).map(withTilePhoto),
    collections: listOf(data.collections).map(withTilePhoto),
  }),
  'range-page': (data) => {
    const slug = typeof data.slug === 'string' ? data.slug : '';
    const name = typeof data.name === 'string' ? data.name : '';
    return {
      ...data,
      photo: data.photo ?? { ...rangePhoto(slug), alt: name },
      gallery: isEmptyList(data.gallery) ? rangeGallery(slug) : data.gallery,
    };
  },
};

export const withPhotoDefaults = (type: string, data: Data): Data =>
  PHOTO_DEFAULTS[type]?.(data) ?? data;

const LIVE: Record<string, () => LiveEntry[]> = {
  home: () => [
    { key: 'home', title: 'Homepage', data: withPhotoDefaults('home', fallbackHomeContent) },
  ],
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
