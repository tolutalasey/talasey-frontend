import type { z } from 'zod';
import {
  getProductsByHandle,
  getRangeListing,
  getRanges,
  rangeFromContent,
  RangePage,
} from '@/features/catalogue';
import {
  BrandStory,
  brandViewFor,
  GuidePage,
  guideViewFor,
  ProjectStory,
  projectViewFor,
  storedGuideSchema,
  storedPageSchema,
  storedProjectSchema,
} from '@/features/content';
import {
  fenceBuilderPath,
  fenceBuilderSchema,
  FenceProduct,
  getFenceCatalogue,
} from '@/features/fencing';
import { getLatestNews, homeContentSchema, HomePage, seasonalBlockFor } from '@/features/home';
import { plainPageSchema, PlainPageView } from '@/features/pages';
import { ProductFinderPage, toFinder } from '@/features/product-finder';
import { parseListingParams } from '@/features/search';
import { NotReady } from './NotReady';

const problemsOf = (error: z.ZodError) =>
  error.issues.map((issue) => `${issue.path.join(' › ') || 'Page'}: ${issue.message}`);

interface Props {
  type: string;
  data: unknown;
}

// A draft drawn by the same components and with the same products as the real page.
export async function PreviewPage({ type, data }: Props) {
  switch (type) {
    case 'home': {
      const parsed = homeContentSchema.safeParse(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      const content = parsed.data;
      const [featured, ranges, news] = await Promise.all([
        getProductsByHandle(content.products),
        getRanges(),
        getLatestNews(),
      ]);
      return (
        <HomePage
          content={content}
          season={seasonalBlockFor(content, new Date())}
          featured={featured}
          news={news}
          rangeNames={ranges.map((range) => range.name)}
        />
      );
    }
    case 'guide': {
      const parsed = storedGuideSchema.safeParse(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      return <GuidePage {...await guideViewFor(parsed.data)} />;
    }
    case 'brand-page': {
      const parsed = storedPageSchema.safeParse(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      return <BrandStory {...await brandViewFor(parsed.data)} />;
    }
    case 'project-page': {
      const parsed = storedProjectSchema.safeParse(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      return <ProjectStory {...await projectViewFor(parsed.data)} />;
    }
    case 'range-page': {
      const parsed = rangeFromContent(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      const params = parseListingParams({});
      const listing = await getRangeListing(parsed.data, params);
      return <RangePage range={parsed.data} listing={listing} params={params} />;
    }
    case 'fence-builder': {
      const parsed = fenceBuilderSchema.safeParse(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      return (
        <div className="container">
          <FenceProduct
            builder={parsed.data}
            catalogue={await getFenceCatalogue(parsed.data)}
            startStyle={0}
            title={parsed.data.name}
            subtitle={parsed.data.intro}
            photos={null}
            singlePath={fenceBuilderPath(parsed.data)}
          />
        </div>
      );
    }
    case 'page': {
      const parsed = plainPageSchema.safeParse(data);
      if (!parsed.success) return <NotReady problems={problemsOf(parsed.error)} />;
      return <PlainPageView page={parsed.data} />;
    }
    case 'product-finder': {
      const finder = toFinder(data);
      if (!finder) return <NotReady problems={['Every question needs at least two answers']} />;
      return (
        <ProductFinderPage finder={finder} answers={{ chosen: {}, areaM2: null }} results={null} />
      );
    }
    default:
      return <NotReady problems={[]} />;
  }
}
