import { describe, expect, it } from 'vitest';
import { checked, lines, money, pence, poundsText, text, whole } from './form';

const form = (entries: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(entries)) data.set(name, value);
  return data;
};

describe('staff form values', () => {
  it('reads prices in pounds as pence', () => {
    expect(pence(form({ price: '£1,022.43' }), 'price')).toBe(102243);
    expect(pence(form({ price: '89.9' }), 'price')).toBe(8990);
    expect(pence(form({ price: ' ' }), 'price')).toBeNull();
    expect(pence(form({ price: 'ten' }), 'price')).toBeNaN();
  });

  it('treats blank as not set', () => {
    expect(text(form({ name: '  ' }), 'name')).toBeNull();
    expect(whole(form({}), 'stock')).toBeNull();
    expect(whole(form({ stock: '2.5' }), 'stock')).toBeNaN();
    expect(checked(form({ published: 'on' }), 'published')).toBe(true);
  });

  it('splits lists one per line and shows money', () => {
    expect(lines('one\n\n two \n')).toEqual(['one', 'two']);
    expect(poundsText(8999)).toBe('89.99');
    expect(money(102243)).toBe('£1,022.43');
  });
});
