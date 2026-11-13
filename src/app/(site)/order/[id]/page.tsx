import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrder, OrderConfirmation } from '@/features/checkout';

export const metadata: Metadata = { title: 'Order placed', robots: { index: false } };

// The whole page renders on the server before it is sent, with no streamed parts, so the basket
// and checkout work with JavaScript off and form errors come back in the HTML.
export const instant = false;

type Props = PageProps<'/order/[id]'>;

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return <OrderConfirmation order={order} />;
}
