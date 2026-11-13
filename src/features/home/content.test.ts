import { describe, expect, it } from 'vitest';
import { fallbackHomeContent, homeContentSchema } from './content';

describe('home content', () => {
  it('the fallback passes the same rules as published content', () => {
    expect(homeContentSchema.safeParse(fallbackHomeContent).success).toBe(true);
  });

  it('rejects an SEO title outside 30–60 characters', () => {
    const result = homeContentSchema.safeParse({
      ...fallbackHomeContent,
      seo: { ...fallbackHomeContent.seo, title: 'Too short' },
    });
    expect(result.success).toBe(false);
  });

  it('allows exactly two hero actions', () => {
    const [samples] = fallbackHomeContent.heroActions;
    const three = { ...fallbackHomeContent, heroActions: [samples, samples, samples] };
    expect(homeContentSchema.safeParse(three).success).toBe(false);
  });

  it('leads the hero with free samples, then the main range', () => {
    expect(fallbackHomeContent.heroActions.map((action) => action.label)).toEqual([
      'Order free samples',
      'Shop porcelain paving',
    ]);
  });
});
