import { describe, expect, it } from 'vitest';
import { brandsWithPages } from '@/lib/brands';
import { pathProblems } from '@/lib/urls/url-rules';
import { fallbackBrands, fallbackGuides, fallbackProjects } from './fallback';
import { brandPagePath, guidePath, projectPath } from './paths';
import { brandPageSchema, guideSchema, projectPageSchema } from './schemas';

describe('fallback content', () => {
  it('has a page for each of the five PRD brands', () => {
    expect(fallbackBrands.map((brand) => brand.slug)).toEqual(
      brandsWithPages.map((brand) => brand.slug),
    );
  });

  it('passes the same rules as published content', () => {
    for (const brand of fallbackBrands) expect(brandPageSchema.safeParse(brand).success).toBe(true);
    for (const project of fallbackProjects) {
      expect(projectPageSchema.safeParse(project).success).toBe(true);
    }
    for (const guide of fallbackGuides) expect(guideSchema.safeParse(guide).success).toBe(true);
  });

  it('marks copy nobody has approved yet, so it stays out of search', () => {
    for (const page of [...fallbackBrands, ...fallbackProjects, ...fallbackGuides]) {
      expect(page.placeholder).toBe(true);
    }
  });

  it('follows the URL rules', () => {
    const paths = [
      ...fallbackBrands.map(brandPagePath),
      ...fallbackProjects.map(projectPath),
      ...fallbackGuides.map(guidePath),
    ];
    for (const path of paths) expect(pathProblems(path)).toEqual([]);
  });

  it('opens every guide with a short answer', () => {
    for (const guide of fallbackGuides) {
      expect(guide.answer.split(/(?<=\.)\s/).length).toBeLessThanOrEqual(2);
    }
  });
});
