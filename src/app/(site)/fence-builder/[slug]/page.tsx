import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRange, rangePath } from '@/features/catalogue';
import {
  FENCING_RANGE,
  FenceBuilderPage,
  fenceBuilderPath,
  getFenceBuilder,
  getFenceCatalogue,
} from '@/features/fencing';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/fence-builder/[slug]'>;

// Builders are added in /content at any time, so the page is drawn on request; its data is cached.
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const builder = await getFenceBuilder((await params).slug);
  if (!builder) notFound();
  return pageMetadata({ ...builder.seo, path: fenceBuilderPath(builder) });
}

export default async function FenceBuilderRoute({ params }: Props) {
  const builder = await getFenceBuilder((await params).slug);
  if (!builder) notFound();
  const [catalogue, range] = await Promise.all([
    getFenceCatalogue(builder),
    getRange(FENCING_RANGE),
  ]);
  return (
    <FenceBuilderPage
      builder={builder}
      catalogue={catalogue}
      range={range && { name: range.name, path: rangePath(range) }}
      path={fenceBuilderPath(builder)}
    />
  );
}
