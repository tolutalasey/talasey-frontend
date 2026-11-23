import { PANELS, type Fixing, type PergolaRules, type PergolaSize, type Slat } from './rules';

// Studio photos for the photo builder, in /public/images/pergola-builder. One whole-pergola photo
// per range, size and fixing, and one straight-on photo per side length and side choice.
const FOLDER = '/images/pergola-builder';

export const PHOTO_WIDTH = 1600;
export const PHOTO_HEIGHT = 1195;

const WHOLE = new Set([
  'origin-3x3-free-standing',
  'origin-4x3-free-standing',
  'origin-3x3-wall-mounted',
  'origin-4x3-wall-mounted',
  'prestige-3x3-free-standing',
  'prestige-4x3-free-standing',
  'prestige-6x4-free-standing',
  'prestige-3x3-wall-mounted',
  'prestige-4x3-wall-mounted',
  'prestige-6x4-wall-mounted',
]);

const SIDE_LENGTHS = [3, 4, 6];

export type SideLook = 'open' | 'screen' | 'horizontal' | 'vertical';

const model = (rules: Pick<PergolaRules, 'slug'>) =>
  rules.slug.startsWith('prestige') ? 'prestige' : 'origin';

// The whole pergola at this size and fixing, or the nearest photo there is.
export function wholePhoto(
  rules: Pick<PergolaRules, 'slug'>,
  size: Pick<PergolaSize, 'width' | 'depth'> | null,
  fixing: Fixing | null,
): string {
  const range = model(rules);
  const shape = size ? `${size.width}x${size.depth}` : '3x3';
  const wanted = [
    `${range}-${shape}-${fixing ?? 'free-standing'}`,
    `${range}-${shape}-free-standing`,
    `${range}-3x3-free-standing`,
  ].find((name) => WHOLE.has(name));
  return `${FOLDER}/${wanted ?? 'origin-3x3-free-standing'}.webp`;
}

// How a side looks with this choice: open, a wind screen, or panels with mostly this kind of slat.
export function sideLook(option: { name: string; kind: string } | null, slats: Slat[]): SideLook {
  if (!option) return 'open';
  if (option.kind === PANELS) {
    const upright = slats.filter((slat) => slat === 'vertical').length;
    return upright * 2 > slats.length ? 'vertical' : 'horizontal';
  }
  return /screen/i.test(option.name) ? 'screen' : 'open';
}

export function sidePhoto(length: number, look: SideLook): string {
  const nearest = SIDE_LENGTHS.reduce((best, candidate) =>
    Math.abs(candidate - length) < Math.abs(best - length) ? candidate : best,
  );
  return `${FOLDER}/side-${nearest}-${look}.webp`;
}
