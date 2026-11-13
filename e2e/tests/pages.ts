import { PRODUCT_HANDLE } from '../fixtures/stack.ts';

export const PRODUCT_PATH = `/products/${PRODUCT_HANDLE}/`;

export const indexablePages = [
  { name: 'home', path: '/' },
  { name: 'product', path: PRODUCT_PATH },
  { name: 'range', path: '/fire-pits/' },
  { name: 'category', path: '/garden-screens/' },
  { name: 'curated filter page', path: '/garden-screens/powder-coated/' },
  { name: 'brands', path: '/brands/' },
  { name: 'brand', path: '/brands/pavetuf/' },
  { name: 'projects', path: '/projects/' },
  { name: 'project', path: '/projects/new-patio/' },
  { name: 'guides hub', path: '/guides/' },
  { name: 'guide', path: '/guides/choosing-a-garden-screen/' },
  { name: 'inspiration', path: '/inspiration/' },
  { name: 'help centre', path: '/help/' },
  { name: 'help topic', path: '/help/returns/' },
  { name: 'contact', path: '/contact/' },
] as const;
