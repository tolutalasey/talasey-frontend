import { expect, type Page } from '@playwright/test';

type Data = Record<string, unknown> & { '@type'?: string };

export async function structuredData(page: Page): Promise<Data[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripts.map((text) => JSON.parse(text) as Data);
}

const absolute = (value: unknown) => typeof value === 'string' && /^https?:\/\//.test(value);

// The fields Google needs for each type we publish (PRD section 13). The Rich Results Test has no
// API, so this is the check CI can run on every template.
const RULES: Record<string, (data: Data) => void> = {
  Organization: (data) => {
    expect(data.name).toBeTruthy();
    expect(absolute(data.url)).toBe(true);
    expect(absolute(data.logo)).toBe(true);
  },
  WebSite: (data) => {
    expect(absolute(data.url)).toBe(true);
    expect(JSON.stringify(data.potentialAction)).toContain('{search_term_string}');
  },
  BreadcrumbList: (data) => {
    const items = data.itemListElement as { position: number; name: string; item: string }[];
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item, index) => {
      expect(item.position).toBe(index + 1);
      expect(item.name).toBeTruthy();
      expect(absolute(item.item)).toBe(true);
    });
  },
  Product: (data) => {
    expect(data.name).toBeTruthy();
    const offers = data.offers as Record<string, string> | undefined;
    if (offers) {
      expect(offers.price).toMatch(/^\d+\.\d{2}$/);
      expect(offers.priceCurrency).toBe('GBP');
      expect(offers.availability).toMatch(/^https:\/\/schema\.org\//);
    }
  },
  CollectionPage: (data) => {
    const list = data.mainEntity as { itemListElement: { position: number; url: string }[] };
    list.itemListElement.forEach((item, index) => {
      expect(item.position).toBe(index + 1);
      expect(absolute(item.url)).toBe(true);
    });
  },
  Article: (data) => {
    expect(data.headline).toBeTruthy();
    expect((data.author as { name?: string }).name).toBeTruthy();
    expect(data.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
  },
};

export function expectValidStructuredData(items: Data[]) {
  for (const item of items) {
    expect(item['@context']).toBe('https://schema.org');
    const rule = RULES[String(item['@type'])];
    expect(rule, `no rule for ${item['@type']}`).toBeDefined();
    rule?.(item);
  }
}
