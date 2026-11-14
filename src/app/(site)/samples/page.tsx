import type { Metadata } from 'next';
import { PageBreadcrumbs } from '@/features/layout';
import { chosenSampleIds, getSampleOffers, SamplesPage } from '@/features/samples';
import { readFeedback } from '@/lib/form-feedback.server';
import { pageMetadata } from '@/lib/seo';

// The sample basket is in a cookie, so the page renders per request (ADR 0020).
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Free paving and garden samples | Talasey',
  description:
    'Order up to five free samples of our paving, edging and garden products, with free postage. We send them the next working day.',
  path: '/samples/',
});

export default async function Samples() {
  const [offers, chosenIds, feedback] = await Promise.all([
    getSampleOffers(),
    chosenSampleIds(),
    readFeedback(),
  ]);
  return (
    <>
      <div className="container">
        <PageBreadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Free samples', path: '/samples/' },
          ]}
        />
      </div>
      <SamplesPage offers={offers} chosenIds={chosenIds} feedback={feedback.samples} />
    </>
  );
}
