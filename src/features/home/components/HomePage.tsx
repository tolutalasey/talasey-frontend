import type { SearchRecord } from '@/features/search';
import type { HomeContent, SeasonalBlock as Block } from '../content';
import { FeaturedProducts } from './FeaturedProducts';
import { HomeHero } from './HomeHero';
import { ProjectTiles } from './ProjectTiles';
import { SeasonalBlock } from './SeasonalBlock';

export interface HomePageProps {
  content: HomeContent;
  season: Block | null;
  featured: SearchRecord[];
}

export function HomePage({ content, season, featured }: HomePageProps) {
  return (
    <>
      <HomeHero content={content} />
      <ProjectTiles tiles={content.projectTiles} />
      {season && <SeasonalBlock block={season} />}
      <FeaturedProducts heading={content.featuredHeading} products={featured} />
    </>
  );
}
