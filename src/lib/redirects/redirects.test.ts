import { describe, expect, it, vi } from 'vitest';
import { ContentRedirectSource } from './content-redirects';
import { cachedRedirectLookup, redirectSource } from './index';
import { localRedirects } from './local-redirects';
import {
  redirectMapProblems,
  redirectMatcher,
  StaticRedirectSource,
  type Redirect,
} from './redirects';

const redirects: Redirect[] = [
  { from: '/porcelain-tiles.html', to: '/porcelain-paving/', permanent: true },
  { from: '/shop/pavetuf/', to: '/brands/pavetuf/', permanent: true },
];

describe('redirectMatcher', () => {
  it('finds a redirect with or without a trailing slash', () => {
    const find = redirectMatcher(redirects);
    expect(find('/porcelain-tiles.html')?.to).toBe('/porcelain-paving/');
    expect(find('/shop/pavetuf')?.to).toBe('/brands/pavetuf/');
    expect(find('/porcelain-paving/')).toBeUndefined();
  });

  it('sends anything under a whole section to its new home, unless the address has its own', () => {
    const find = redirectMatcher([
      { from: '/brochure/*', to: '/brochure-acknowledgements/', permanent: true },
      { from: '/brochure/murray/', to: '/inspiration/', permanent: true },
    ]);
    expect(find('/brochure/wirral-landscapes/')?.to).toBe('/brochure-acknowledgements/');
    expect(find('/brochure/murray')?.to).toBe('/inspiration/');
    expect(find('/brochure/')).toBeUndefined();
  });
});

describe('the redirect map', () => {
  it('has no loops, chains or duplicates', () => {
    expect(redirectMapProblems(localRedirects)).toEqual([]);
  });

  it('catches loops, chains and duplicates', () => {
    expect(
      redirectMapProblems([
        { from: '/a', to: '/a/', permanent: true },
        { from: '/b', to: '/c', permanent: true },
        { from: '/c', to: '/d', permanent: true },
        { from: '/c/', to: '/e', permanent: true },
        { from: 'old', to: '/f', permanent: true },
      ]),
    ).toEqual([
      '/c/ is redirected twice',
      'old must start with /',
      '/a redirects to itself',
      '/b goes to /c, which redirects again; point it at the final page',
    ]);
  });
});

describe('where redirects come from', () => {
  it('adds the redirects published in /content to the URL map, and lets them win', async () => {
    const source = new ContentRedirectSource(new StaticRedirectSource(redirects), async () => [
      { from: '/new-offer', to: '/porcelain-paving/', permanent: false },
      { from: '/shop/pavetuf/', to: '/somewhere-else/' },
      { title: 'not a redirect' },
    ]);
    expect(await source.all()).toEqual([
      { from: '/porcelain-tiles.html', to: '/porcelain-paving/', permanent: true },
      { from: '/new-offer', to: '/porcelain-paving/', permanent: false },
      { from: '/shop/pavetuf/', to: '/somewhere-else/', permanent: true },
    ]);
  });

  it('starts from the URL map in the repo', async () => {
    expect(await redirectSource(async () => []).all()).toEqual(localRedirects);
  });
});

describe('cachedRedirectLookup', () => {
  it('loads the map once a minute at most', async () => {
    let time = 0;
    const source = new StaticRedirectSource(redirects);
    const all = vi.spyOn(source, 'all');
    const lookup = cachedRedirectLookup(source, 60_000, () => time);

    await lookup('/porcelain-tiles.html');
    await lookup('/shop/pavetuf');
    expect(all).toHaveBeenCalledTimes(1);
    time = 61_000;
    await lookup('/anything');
    expect(all).toHaveBeenCalledTimes(2);
  });

  it('keeps serving pages if the source fails', async () => {
    const lookup = cachedRedirectLookup({
      name: 'broken',
      all: async () => {
        throw new Error('down');
      },
    });
    await expect(lookup('/porcelain-tiles.html')).resolves.toBeUndefined();
  });
});
