// The API sends these when something changes, so the site rebuilds only what is affected.
export const cacheTags = {
  home: 'content:home',
  brandPages: 'content:brand-page',
  projectPages: 'content:project-page',
  ranges: 'content:range-page',
  guides: 'content:guide',
  inspiration: 'content:inspiration',
  faqs: 'content:faq',
  navigation: 'content:navigation',
  redirects: 'content:redirect',
  productExtras: 'content:product-extras',
  samples: 'samples',
  products: 'products',
  product: (handle: string) => `product:${handle}`,
  productContent: (handle: string) => `productContent:${handle}`,
} as const;
