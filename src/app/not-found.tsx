import type { Metadata } from 'next';
import { NotFoundPage, SiteChrome } from '@/features/layout';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

// Addresses that match no route at all still get the shop's header and footer.
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundPage />
    </SiteChrome>
  );
}
