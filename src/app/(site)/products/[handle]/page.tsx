import type { Metadata } from 'next';
import { ProductRoute, productRouteMetadata } from './product-route';

// Options come from the query string and the basket form shows the server's errors without
// JavaScript, so the page renders per request and in full before it is sent (ADR 0020). An
// unknown handle is a real 404.
export const instant = false;

type Props = PageProps<'/products/[handle]'>;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return productRouteMetadata((await params).handle, await searchParams);
}

export default async function Product({ params, searchParams }: Props) {
  return <ProductRoute handle={(await params).handle} query={await searchParams} />;
}
