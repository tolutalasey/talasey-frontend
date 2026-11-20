import type { Metadata } from 'next';
import { ProductRoute, productRouteMetadata } from '../product-route';

// One colour of a product sold in several, at its own address as on the current site.
export const instant = false;

type Props = PageProps<'/products/[handle]/[colour]'>;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { handle, colour } = await params;
  return productRouteMetadata(handle, await searchParams, colour);
}

export default async function ProductColour({ params, searchParams }: Props) {
  const { handle, colour } = await params;
  return <ProductRoute handle={handle} query={await searchParams} colourSlug={colour} />;
}
