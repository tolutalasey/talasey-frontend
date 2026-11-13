import { describe, expect, it } from 'vitest';
import { emptyProductContent, extrasFor } from './content';

const paving = {
  product: 'silver-grey-porcelain-paving',
  completeTheJob: [{ handle: 'pavetuf-jointing-compound', reason: 'Fills the joints' }],
  documents: [{ title: 'Spec sheet', url: '/downloads/silver-grey.pdf' }],
  features: ['R11 slip rating'],
  warranty: '25-year guarantee',
};

describe('product extras', () => {
  it('uses what is published for that product', () => {
    expect(extrasFor('silver-grey-porcelain-paving', [{ product: 'other' }, paving])).toEqual({
      completeTheJob: paving.completeTheJob,
      documents: paving.documents,
      features: paving.features,
      warranty: paving.warranty,
    });
  });

  it('shows nothing extra for a product without any, or with an entry it cannot read', () => {
    expect(extrasFor('sienna-planter', [paving])).toEqual(emptyProductContent);
    expect(extrasFor('broken', [{ product: 'broken', features: 'not a list' }])).toEqual(
      emptyProductContent,
    );
  });
});
