import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { ProductCard, type ProductCardProps } from './ProductCard';

const product: ProductCardProps = {
  href: '/products/dusk-grey-porcelain-paving/',
  name: 'Dusk grey porcelain paving',
  image: { src: '/dusk.jpg', alt: 'Dusk grey slabs laid on a patio', width: 800, height: 600 },
  price: '£89.99',
  priceNote: 'per pack of 4',
  stock: { level: 'in-stock', label: '12 in stock' },
};

describe('ProductCard', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ProductCard {...product} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is one tab stop, named by the product', async () => {
    const user = userEvent.setup();
    render(<ProductCard {...product} />);
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole('link', { name: 'Dusk grey porcelain paving' }),
    );
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });

  it('says when there is no price yet', () => {
    render(<ProductCard {...product} price={null} />);
    expect(screen.getByText('Price on request')).toBeTruthy();
  });

  it('loads its photo lazily unless asked not to', () => {
    const { rerender } = render(<ProductCard {...product} />);
    expect(screen.getByRole('img').getAttribute('loading')).toBe('lazy');
    rerender(<ProductCard {...product} loading="eager" />);
    expect(screen.getByRole('img').getAttribute('loading')).toBe('eager');
  });
});
