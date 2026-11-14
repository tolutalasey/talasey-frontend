import { TrustStrip } from '@/ui/TrustStrip/TrustStrip';
import type { SearchRecord } from '@/features/search';
import { trustPoints } from '@/lib/trust-points';
import { brochuresPage, showcaseColumns } from '../brand';
import type { HomeContent, SeasonalBlock as Block } from '../content';
import { FeaturedProducts } from './FeaturedProducts';
import { HomeHero } from './HomeHero';
import { ProjectTiles } from './ProjectTiles';
import { SeasonalBlock } from './SeasonalBlock';
import { Showcase } from './Showcase';
import { BrochureRow, MadeToMeasure, SamplesBand } from './StorySections';

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
      <TrustStrip points={trustPoints} label="Why buy from Talasey" />
      <FeaturedProducts heading={content.featuredHeading} products={featured} />
      <Showcase columns={showcaseColumns} brochuresHref={brochuresPage} />
      {season && <SeasonalBlock block={season} />}
      <MadeToMeasure />
      <SamplesBand />
      <BrochureRow />
    </>
  );
}
