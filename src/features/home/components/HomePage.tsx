import { TrustStrip } from '@/ui/TrustStrip/TrustStrip';
import type { SearchRecord } from '@/features/search';
import { trustPoints } from '@/lib/trust-points';
import type { HomeContent, SeasonalBlock as Block } from '../content';
import { ClosingBlock } from './ClosingBlock';
import { FeaturedProducts } from './FeaturedProducts';
import { HomeHero } from './HomeHero';
import { LatestNews, type NewsItem } from './LatestNews';
import { PlanningSteps } from './PlanningSteps';
import { SamplesBlock } from './SamplesBlock';
import { SeasonalBlock } from './SeasonalBlock';
import { TileSection } from './TileSection';
import { WhyTalasey } from './WhyTalasey';

export interface HomePageProps {
  content: HomeContent;
  season: Block | null;
  featured: SearchRecord[];
  news: NewsItem[];
  rangeNames: string[];
}

// In the order of the current talasey.co.uk homepage, with the shop's own sections added.
export function HomePage({ content, season, featured, news, rangeNames }: HomePageProps) {
  return (
    <>
      <HomeHero content={content} rangeNames={rangeNames} />
      <TrustStrip points={trustPoints} label="Why buy from Talasey" />
      <TileSection
        id="projects-title"
        eyebrow="Outdoor living"
        heading={content.projectsHeading}
        intro={content.projectsIntro}
        tiles={content.projectTiles}
      />
      <WhyTalasey {...content} />
      <TileSection
        id="collections-title"
        eyebrow="Collections"
        heading={content.collectionsHeading}
        intro={content.collectionsIntro}
        tiles={content.collections}
      />
      <FeaturedProducts heading={content.featuredHeading} products={featured} />
      <PlanningSteps {...content} />
      {season && <SeasonalBlock block={season} />}
      <LatestNews heading={content.newsHeading} intro={content.newsIntro} items={news} />
      <SamplesBlock {...content} />
      <ClosingBlock {...content} />
    </>
  );
}
