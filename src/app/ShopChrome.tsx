import { Suspense, type ReactNode } from 'react';
import { Assistant } from '@/features/assistant';
import { CurrentBag } from '@/features/checkout';
import { BagLink, SiteChrome } from '@/features/layout';
import { EditThisPage } from '@/features/live-preview';

// The shop's header and footer, with the bag count streamed in from the visitor's basket.
export function ShopChrome({ children }: { children: ReactNode }) {
  return (
    <SiteChrome
      bag={
        <Suspense fallback={<BagLink count={0} />}>
          <CurrentBag />
        </Suspense>
      }
    >
      {children}
      <EditThisPage />
      <Assistant />
    </SiteChrome>
  );
}
