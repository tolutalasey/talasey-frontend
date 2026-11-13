import { SkipLink } from '@/ui';
import type { ReactNode } from 'react';
import { ConsentManager, consentDefaultsScript } from '@/features/consent';
import { SiteFooter, SiteHeader } from '@/features/layout';
import { env } from '@/lib/env';
import { JsonLd } from '@/lib/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <ConsentManager secureCookie={env.APP_ENV !== 'development'} />
    </>
  );
}
