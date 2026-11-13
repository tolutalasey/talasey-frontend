import type { HomeContent, Season, SeasonalBlock } from './content';

const SEASON_BY_MONTH: Season[] = [
  'winter',
  'winter',
  'spring',
  'spring',
  'spring',
  'summer',
  'summer',
  'summer',
  'autumn',
  'autumn',
  'autumn',
  'winter',
];

export const seasonFor = (date: Date): Season => SEASON_BY_MONTH[date.getUTCMonth()] ?? 'spring';

export function seasonalBlockFor(content: HomeContent, date: Date): SeasonalBlock | null {
  const season = seasonFor(date);
  return content.seasonalBlocks.find((block) => block.season === season) ?? null;
}
