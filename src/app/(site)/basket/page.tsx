import type { Metadata } from 'next';
import { BasketSummary, buyAgainFeedback, getBasketView } from '@/features/checkout';
import { readFeedback } from '@/lib/form-feedback.server';

export const metadata: Metadata = { title: 'Your bag', robots: { index: false } };

// The whole page renders on the server before it is sent, with no streamed parts, so the basket
// and checkout work with JavaScript off and form errors come back in the HTML.
export const instant = false;

export default async function BasketPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [view, feedback, params] = await Promise.all([
    getBasketView(),
    readFeedback(),
    searchParams,
  ]);
  return (
    <BasketSummary
      view={view}
      promotionFeedback={feedback.promotion}
      linesFeedback={feedback.lines ?? buyAgainFeedback(params.again)}
    />
  );
}
