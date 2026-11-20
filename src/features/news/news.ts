import { NEWS_CATEGORIES, type NewsCategory, type NewsPost } from './schemas';

export const NEWS_PATH = '/news/';
export const PAGE_SIZE = 12;

export const newsPostPath = (post: Pick<NewsPost, 'slug'>) => `${NEWS_PATH}${post.slug}/`;

export interface NewsFilters {
  category: NewsCategory | null;
  page: number;
}

type Params = Record<string, string | string[] | undefined>;
const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export function parseNewsFilters(params: Params): NewsFilters {
  const page = Number.parseInt(one(params.page), 10);
  return {
    category: NEWS_CATEGORIES.find((category) => category === one(params.category)) ?? null,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function newsHref(filters: NewsFilters, change: Partial<NewsFilters> = {}) {
  const next = { ...filters, ...change };
  const params = new URLSearchParams();
  if (next.category) params.set('category', next.category);
  if (next.page > 1) params.set('page', String(next.page));
  const query = params.toString();
  return `${NEWS_PATH}${query ? `?${query}` : ''}`;
}

export function filterNews(posts: NewsPost[], filters: NewsFilters) {
  const matching = posts.filter(
    (post) => !filters.category || post.categories.includes(filters.category),
  );
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  return {
    total: matching.length,
    page,
    pages,
    shown: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    counts: Object.fromEntries(
      NEWS_CATEGORIES.map((category) => [
        category,
        posts.filter((post) => post.categories.includes(category)).length,
      ]),
    ) as Record<NewsCategory, number>,
  };
}

// Posts sharing a category come first, then the newest of the rest.
export function relatedPosts(post: NewsPost, posts: NewsPost[], count = 3) {
  const others = posts.filter((other) => other.slug !== post.slug);
  const shares = (other: NewsPost) =>
    other.categories.some((category) => post.categories.includes(category));
  return [...others.filter(shares), ...others.filter((other) => !shares(other))].slice(0, count);
}

export const formatNewsDate = (date: string) =>
  new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
