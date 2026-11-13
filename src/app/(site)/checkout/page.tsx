import type { Metadata } from 'next';
import { CheckoutFlow, getCheckoutView } from '@/features/checkout';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

// The whole page renders on the server before it is sent, with no streamed parts, so the basket
// and checkout work with JavaScript off and form errors come back in the HTML.
export const instant = false;

export default async function CheckoutPage() {
  return <CheckoutFlow view={await getCheckoutView()} />;
}
