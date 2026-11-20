import 'server-only';
import { rangePhoto } from '@/features/catalogue';
import { FENCING_RANGE, fenceBuilderPath, getFenceBuilders } from '@/features/fencing';
import { getPergolaPages, PERGOLA_RANGE } from '@/features/pergola';
import type { Builder } from './builders';

// Every builder published in /content: pergolas first, then fences.
export async function getBuilders(): Promise<Builder[]> {
  const [pergolas, fences] = await Promise.all([getPergolaPages(), getFenceBuilders()]);
  return [
    ...pergolas.map(({ builder, path }) => ({
      name: `${builder.range} pergola builder`,
      summary: 'Pick the size, sides and extras, and see the price as you go.',
      path,
      image: rangePhoto(PERGOLA_RANGE).src,
      topics: ['pergola', 'gazebo', 'canopy', 'shade'],
    })),
    ...fences.map((builder) => ({
      name: `${builder.name} kit builder`,
      summary: 'Choose the style, colour, length and height, and we work out every part.',
      path: fenceBuilderPath(builder),
      image: rangePhoto(FENCING_RANGE).src,
      topics: ['fenc', 'trellis'],
    })),
  ];
}
