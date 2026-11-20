import type { z } from 'zod';
import {
  getProductsByHandle,
  getRangeListing,
  getRange,
  getRanges,
  rangeFromContent,
  RangePage,
  rangePath,
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
  FENCING_RANGE,
  FenceBuilderPage,
  fenceBuilderPath,
  fenceBuilderSchema,
  getFenceCatalogue,
} from '@/features/fencing';
import { homeContentSchema, HomePage, seasonalBlockFor } from '@/features/home';
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
      const [featured, ranges] = await Promise.all([
        getProductsByHandle(content.products),
        getRanges(),
      ]);
      return (
        <HomePage
          content={content}
          season={seasonalBlockFor(content, new Date())}
          featured={featured}
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
      const [catalogue, range] = await Promise.all([
        getFenceCatalogue(parsed.data),
        getRange(FENCING_RANGE),
      ]);
      return (
        <FenceBuilderPage
          builder={parsed.data}
          catalogue={catalogue}
          range={range && { name: range.name, path: rangePath(range) }}
          path={fenceBuilderPath(parsed.data)}
        />
      );
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
