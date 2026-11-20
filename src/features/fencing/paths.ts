import { productPath } from '@/lib/urls/keyword-map';

export const FENCING_RANGE = 'composite-fencing';

// Builders used to have pages of their own at /fence-builder/<slug>/.
export const oldFenceBuilderPath = (builder: { slug: string }) => `/fence-builder/${builder.slug}/`;

// Where a builder lives now: on its first style's board product page.
export const fenceBuilderPath = (builder: { styles: { boardProduct: string }[] }) =>
  productPath(builder.styles[0]?.boardProduct ?? '');
