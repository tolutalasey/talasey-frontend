import { ContentRedirectSource } from './content-redirects';
import { localRedirects } from './local-redirects';
import {
  redirectMatcher,
  StaticRedirectSource,
  type Redirect,
  type RedirectSource,
} from './redirects';

export function redirectSource(published: () => Promise<unknown[]>): RedirectSource {
  return new ContentRedirectSource(new StaticRedirectSource(localRedirects), published);
}

// Keeps the map in memory and refreshes it at most once a minute, so a redirect published in
// /content goes live within a minute without slowing every request.
export function cachedRedirectLookup(source: RedirectSource, maxAgeMs = 60_000, now = Date.now) {
  let loaded: { at: number; find: (path: string) => Redirect | undefined } | undefined;
  return async (pathname: string): Promise<Redirect | undefined> => {
    if (!loaded || now() - loaded.at > maxAgeMs) {
      try {
        loaded = { at: now(), find: redirectMatcher(await source.all()) };
      } catch {
        loaded ??= { at: now(), find: () => undefined };
      }
    }
    return loaded.find(pathname);
  };
}

export {
  redirectMapProblems,
  StaticRedirectSource,
  type Redirect,
  type RedirectSource,
} from './redirects';
