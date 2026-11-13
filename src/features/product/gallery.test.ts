import { describe, expect, it } from 'vitest';
import type { ProductPhoto } from './content';
import { photosFor } from './gallery';

const photo = (src: string, extra: Partial<ProductPhoto> = {}): ProductPhoto => ({
  src,
  alt: src,
  width: 800,
  height: 600,
  ...extra,
});

const photos = [
  photo('laid.jpg'),
  photo('weathered.jpg', { finish: 'Weathered Steel' }),
  photo('anthracite-small.jpg', {
    finish: 'Powder Coated',
    colour: 'Anthracite grey',
    size: '1800 × 300 mm',
  }),
  photo('powder.jpg', { finish: 'Powder Coated' }),
];

describe('photosFor', () => {
  it('swaps to the photos for the finish chosen, most specific first', () => {
    const shown = photosFor(
      photos,
      { size: '1800 × 300 mm', finish: 'Powder Coated', colour: 'Anthracite grey' },
      { title: 'V' },
      'Screen',
    );
    expect(shown.map((p) => p.src)).toEqual(['anthracite-small.jpg', 'powder.jpg', 'laid.jpg']);
  });

  it('drops photos of other sizes, finishes and colours', () => {
    const shown = photosFor(photos, { finish: 'Weathered Steel' }, { title: 'V' }, 'Screen');
    expect(shown.map((p) => p.src)).toEqual(['weathered.jpg', 'laid.jpg']);
  });

  it('puts the option’s own photo first', () => {
    const shown = photosFor(
      [],
      {},
      { title: '600 × 600', thumbnail: 'https://cdn/v.jpg' },
      'Paving',
    );
    expect(shown[0]).toMatchObject({ src: 'https://cdn/v.jpg', alt: 'Paving, 600 × 600' });
  });
});
