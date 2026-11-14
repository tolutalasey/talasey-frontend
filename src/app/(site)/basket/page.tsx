import type { Metadata } from 'next';
import { BasketSummary, getBasketView } from '@/features/checkout';
import { readFeedback } from '@/lib/form-feedback.server';

export const metadata: Metadata = { title: 'Basket', robots: { index: false } };

// The whole page renders on the server before it is sent, with no streamed parts, so the basket
// and checkout work with JavaScript off and form errors come back in the HTML.
export const instant = false;

export default async function BasketPage() {
  const [view, feedback] = await Promise.all([getBasketView(), readFeedback()]);
  return (
    <BasketSummary
      view={view}
      promotionFeedback={feedback.promotion}
      linesFeedback={feedback.lines}
    />
  );
}
