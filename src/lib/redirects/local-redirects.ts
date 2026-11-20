import type { Redirect } from './redirects';
import oldSite from './old-site-redirects.json';

// Every address in the current talasey.co.uk sitemaps and its new home (PRD section 13), built by
// scripts/redirect-map/build.mjs; tested by redirects.test.ts.
export const localRedirects: Redirect[] = oldSite;
