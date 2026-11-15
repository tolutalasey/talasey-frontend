import { Suspense } from 'react';
import { BagDrawer, BagPanel, BagPanelLoading, getBasketView } from '@/features/checkout';
import { readFeedback } from '@/lib/form-feedback.server';

async function Bag() {
  const [view, feedback] = await Promise.all([getBasketView(), readFeedback()]);
  return <BagPanel view={view} feedback={feedback.lines} />;
}

// Opening the bag from a page slides it in over that page straight away, and the lines follow.
// Loading /basket/ itself still shows the full bag page.
export default function BagDrawerPage() {
  return (
    <BagDrawer>
      <Suspense fallback={<BagPanelLoading />}>
        <Bag />
      </Suspense>
    </BagDrawer>
  );
}
