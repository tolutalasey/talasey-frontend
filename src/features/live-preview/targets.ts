// Content that has a page of its own on the site, and where that page lives.
const PATHS: Record<string, (key: string) => string> = {
  home: () => '/',
  guide: (key) => `/guides/${key}/`,
  'brand-page': (key) => `/brands/${key}/`,
  'project-page': (key) => `/projects/${key}/`,
  'range-page': (key) => `/${key}/`,
};

export const hasPagePreview = (type: string) => type in PATHS;

export function sitePathFor(type: string, key: string): string | null {
  const path = PATHS[type];
  return path && (type === 'home' || key) ? path(key) : null;
}

// The other way round, for "Edit this page" on the site.
export function contentFor(path: string): { type: string; key: string } | null {
  const [first, second, ...rest] = path.split('/').filter(Boolean);
  if (!first) return { type: 'home', key: 'home' };
  if (rest.length > 0) return null;
  if (second) {
    const type = { guides: 'guide', brands: 'brand-page', projects: 'project-page' }[first];
    return type ? { type, key: second } : null;
  }
  return { type: 'range-page', key: first };
}
