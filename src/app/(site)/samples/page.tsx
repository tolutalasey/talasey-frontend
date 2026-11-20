import type { Metadata } from 'next';
import { getBasket } from '@/features/checkout';
import { PageBreadcrumbs } from '@/features/layout';
import { getSampleOffers, SamplesPage } from '@/features/samples';
import { readFeedback } from '@/lib/form-feedback.server';
import { pageMetadata } from '@/lib/seo';

// The samples chosen are in the bag, so the page renders per request (ADR 0020).
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Paving and garden samples, three free | Talasey',
  description:
    'Order samples of our paving, edging and garden products. The first three are free, and we send them the next working day.',
  path: '/samples/',
});

export default async function Samples() {
  const [offers, basket, feedback] = await Promise.all([
    getSampleOffers(),
    getBasket(),
    readFeedback(),
  ]);
  return (
    <>
      <div className="container">
        <PageBreadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Samples', path: '/samples/' },
          ]}
        />
      </div>
      <SamplesPage offers={offers} chosen={basket?.samples ?? []} feedback={feedback.samples} />
    </>
  );
}
