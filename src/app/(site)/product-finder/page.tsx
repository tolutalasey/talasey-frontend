import type { Metadata } from 'next';
import {
  getFinderResults,
  getProductFinder,
  hasAnswers,
  PRODUCT_FINDER_PATH,
  ProductFinderPage,
  readAnswers,
} from '@/features/product-finder';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/product-finder'>;

// The answers arrive in the query string, so the page is drawn per request. Only the plain
// questions page is indexed; every set of answers points back to it.
export const instant = false;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const finder = await getProductFinder();
  return pageMetadata({
    ...finder.seo,
    path: PRODUCT_FINDER_PATH,
    noindex: Object.keys(await searchParams).length > 0,
  });
}

export default async function ProductFinderRoute({ searchParams }: Props) {
  const finder = await getProductFinder();
  const answers = readAnswers(finder, await searchParams);
  const results = hasAnswers(answers) ? await getFinderResults(answers) : null;
  return <ProductFinderPage finder={finder} answers={answers} results={results} />;
}
