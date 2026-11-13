import { describe, expect, it } from 'vitest';
import { keywordMap, productPath } from './keyword-map';
import { pathProblems, slugProblems } from './url-rules';

describe('the PRD section 13 keyword map', () => {
  it('has all 11 keywords, each with one main page', () => {
    expect(keywordMap.map((page) => page.keyword)).toEqual([
      'porcelain paving',
      'stone paving',
      'composite decking',
      'composite cladding',
      'composite fencing',
      'paving jointing compound',
      'pergolas',
      'garden rooms',
      'planters',
      'fire pits',
      'garden sculptures',
    ]);
  });

  it('gives every page its own path, used once', () => {
    const paths = keywordMap.flatMap((page) => [page.path, ...page.supporting]);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it.each(keywordMap.flatMap((page) => [page.path, ...page.supporting]))(
    '%s follows the URL rules',
    (path) => {
      expect(pathProblems(path)).toEqual([]);
    },
  );

  it('builds product paths like the PRD example', () => {
    expect(productPath('vitripiazza-dusk-grey-porcelain-paving')).toBe(
      '/products/vitripiazza-dusk-grey-porcelain-paving/',
    );
  });
});

describe('the slug linter', () => {
  it.each([
    ['Porcelain-Paving', /lowercase/],
    ['porcelain_paving', /lowercase/],
    ['patio-cost-2026', /date/],
    ['product-1234567', /code or ID/],
    ['a'.repeat(81), /longer than 80/],
  ])('catches %s', (slug, message) => {
    expect(slugProblems(slug).join(' ')).toMatch(message);
  });

  it('wants a slash at both ends and no query in page paths', () => {
    expect(pathProblems('/porcelain-paving')).toEqual([
      '/porcelain-paving should start and end with /',
    ]);
    expect(pathProblems('/porcelain-paving/?colour=grey/')[0]).toMatch(/query/);
    expect(pathProblems('/')).toEqual([]);
  });
});
