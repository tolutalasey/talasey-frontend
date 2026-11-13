import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { QandA } from './QandA';

const items = [
  {
    question: 'Can I lay it on sand?',
    answer: 'No. Lay porcelain on a full mortar bed with a priming slurry.',
    answeredBy: 'Talasey technical team',
  },
  { question: 'Is it frost proof?', answer: 'Yes, it absorbs less than 0.5% water.' },
];

describe('QandA', () => {
  it('has no axe violations', async () => {
    const { container } = render(<QandA items={items} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('pairs each question with its answer as terms and definitions', () => {
    render(<QandA items={items} />);
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      'Can I lay it on sand?',
      'Is it frost proof?',
    ]);
    expect(screen.getAllByRole('definition')).toHaveLength(2);
  });
});
