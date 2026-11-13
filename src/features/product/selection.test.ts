import { describe, expect, it } from 'vitest';
import { testProduct, testVariant } from '@/test/products';
import { optionGroups, resolveSelection } from './selection';

const stocked = (quantity: number) => ({ managed: true, quantity, backorder: false });

const paving = testProduct({
  options: [
    { title: 'Colour', values: ['Dusk grey', 'Ivory', 'Charcoal'] },
    { title: 'Size', values: ['600 × 600 mm', '900 × 600 mm'] },
  ],
  variants: [
    testVariant({
      id: 'dusk-600',
      options: { Colour: 'Dusk grey', Size: '600 × 600 mm' },
      stock: stocked(0),
    }),
    testVariant({
      id: 'ivory-600',
      options: { Colour: 'Ivory', Size: '600 × 600 mm' },
      stock: stocked(8),
    }),
    testVariant({
      id: 'ivory-900',
      options: { Colour: 'Ivory', Size: '900 × 600 mm' },
      stock: stocked(0),
    }),
    testVariant({
      id: 'charcoal-900',
      options: { Colour: 'Charcoal', Size: '900 × 600 mm' },
      stock: stocked(3),
    }),
  ],
});

describe('resolveSelection: ?colour=', () => {
  it('opens on the colour asked for when it is in stock', () => {
    expect(resolveSelection(paving, { colour: 'charcoal' }).variant?.id).toBe('charcoal-900');
  });

  it('opens on the first colour in stock when the one asked for is sold out', () => {
    expect(resolveSelection(paving, { colour: 'dusk-grey' }).variant?.id).toBe('ivory-600');
  });

  it('opens on the first colour in stock with no colour asked for', () => {
    expect(resolveSelection(paving, {}).options).toEqual({ Colour: 'Ivory', Size: '600 × 600 mm' });
  });
});

describe('resolveSelection: other options', () => {
  it('keeps the options asked for that go together', () => {
    expect(resolveSelection(paving, { colour: 'ivory', size: '900-x-600-mm' }).variant?.id).toBe(
      'ivory-900',
    );
  });

  it('ignores values the product does not have', () => {
    expect(resolveSelection(paving, { size: 'huge' }).variant?.id).toBe('ivory-600');
  });

  it('passes a colour set swatch through when the product has no Colour option', () => {
    const screen = testProduct({
      options: [{ title: 'Finish', values: ['Powder Coated'] }],
      variants: [testVariant({ options: { Finish: 'Powder Coated' } })],
    });
    expect(resolveSelection(screen, { colour: 'jet-black-ral-9005' }).colourParam).toBe(
      'jet-black-ral-9005',
    );
  });
});

describe('resolveSelection: prices', () => {
  it('opens on an option that has a price before one that has none', () => {
    const screen = testProduct({
      options: [{ title: 'Finish', values: ['Weathered Steel', 'Galvanised Steel'] }],
      variants: [
        testVariant({ id: 'weathered', options: { Finish: 'Weathered Steel' } }),
        testVariant({
          id: 'galvanised',
          options: { Finish: 'Galvanised Steel' },
          priceIncVat: { amount: 79.99, currencyCode: 'GBP' },
        }),
      ],
    });
    expect(resolveSelection(screen, {}).variant?.id).toBe('galvanised');
  });
});

describe('optionGroups', () => {
  it('links each value to the URL that chooses it and marks what can be bought', () => {
    const groups = optionGroups(paving, resolveSelection(paving, {}));
    const sizes = groups.find((group) => group.title === 'Size');
    expect(sizes?.choices).toEqual([
      {
        value: '600 × 600 mm',
        params: { colour: 'ivory', size: '600-x-600-mm' },
        current: true,
        available: true,
      },
      {
        value: '900 × 600 mm',
        params: { colour: 'ivory', size: '900-x-600-mm' },
        current: false,
        available: false,
      },
    ]);
  });
});
