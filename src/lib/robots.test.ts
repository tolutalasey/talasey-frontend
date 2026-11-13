import { describe, expect, it } from 'vitest';
import { PRIVATE_PATHS, robotsRules } from './robots';

const sitemap = 'https://talasey.co.uk/sitemap.xml';

describe('robotsRules', () => {
  it('blocks everything outside production', () => {
    expect(robotsRules({ production: false, allowTraining: true, sitemap })).toEqual({
      rules: { userAgent: '*', disallow: '/' },
    });
  });

  it('lets search and AI search crawlers in, away from private pages', () => {
    const robots = robotsRules({ production: true, allowTraining: false, sitemap });
    const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
    expect(rules[0]).toMatchObject({ allow: '/', disallow: PRIVATE_PATHS });
    expect(rules[0]?.userAgent).toEqual(
      expect.arrayContaining([
        'Googlebot',
        'Bingbot',
        'OAI-SearchBot',
        'ChatGPT-User',
        'PerplexityBot',
      ]),
    );
    expect(PRIVATE_PATHS).toEqual(
      expect.arrayContaining(['/basket/', '/checkout/', '/account/', '/search/']),
    );
    expect(robots.sitemap).toBe(sitemap);
  });

  it('treats training crawlers as a separate setting', () => {
    const blocked = robotsRules({ production: true, allowTraining: false, sitemap });
    const allowed = robotsRules({ production: true, allowTraining: true, sitemap });
    const training = (robots: typeof blocked) =>
      (Array.isArray(robots.rules) ? robots.rules : [robots.rules]).find((rule) =>
        [rule.userAgent].flat().includes('GPTBot'),
      );
    expect(training(blocked)).toEqual(expect.objectContaining({ disallow: '/' }));
    expect(training(allowed)).toEqual(expect.objectContaining({ allow: '/' }));
  });
});
