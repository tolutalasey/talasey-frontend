import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { StockStatus, type StockLevel } from './StockStatus';

const levels: [StockLevel, string][] = [
  ['in-stock', '12 in stock'],
  ['low-stock', 'Only 3 left'],
  ['out-of-stock', 'Out of stock'],
  ['made-to-order', 'Made to order, 3 to 4 weeks'],
];

describe('StockStatus', () => {
  it.each(levels)('says %s in words, with the icon hidden', async (level, label) => {
    const { container } = render(<StockStatus level={level} label={label} />);
    expect(screen.getByText(label)).toBeTruthy();
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(await axeViolations(container)).toEqual([]);
  });
});
