import { TrustStrip } from '@/ui/TrustStrip/TrustStrip';
import type { SearchRecord } from '@/features/search';
import { trustPoints } from '@/lib/trust-points';
import { gardenPhotos, pergolaPhotos } from '../brand';
import type { HomeContent, SeasonalBlock as Block } from '../content';
import { FeaturedProducts } from './FeaturedProducts';
import { GardenReel } from './GardenReel';
import { HomeHero } from './HomeHero';
import { PergolaFeature } from './PergolaFeature';
import { ProjectTiles } from './ProjectTiles';
import { SeasonalBlock } from './SeasonalBlock';
import { StoryPair } from './StorySections';

export interface HomePageProps {
  content: HomeContent;
  season: Block | null;
  featured: SearchRecord[];
  rangeNames: string[];
}

export function HomePage({ content, season, featured, rangeNames }: HomePageProps) {
  return (
    <>
      <HomeHero content={content} rangeNames={rangeNames} />
      <ProjectTiles tiles={content.projectTiles} />
      <FeaturedProducts heading={content.featuredHeading} products={featured} />
      <GardenReel photos={gardenPhotos} />
      <PergolaFeature photos={pergolaPhotos} />
      {season && <SeasonalBlock block={season} />}
      <StoryPair />
      <TrustStrip points={trustPoints} label="Why buy from Talasey" />
    </>
  );
}
