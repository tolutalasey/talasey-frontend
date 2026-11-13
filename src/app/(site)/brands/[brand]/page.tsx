import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brandPagePath, getBrandPages, getBrandView, StoryPage } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/brands/[brand]'>;

export async function generateStaticParams() {
  return (await getBrandPages()).map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const view = await getBrandView((await params).brand);
  if (!view) notFound();
  return pageMetadata({
    ...view.page.seo,
    path: brandPagePath(view.page),
    noindex: view.page.placeholder,
  });
}

export default async function Brand({ params }: Props) {
  const view = await getBrandView((await params).brand);
  if (!view) notFound();
  const { page } = view;
  return (
    <StoryPage
      {...view}
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Brands', path: '/brands/' },
        { name: page.name, path: brandPagePath(page) },
      ]}
      productsHeading={`${page.name} products`}
      pointsHeading="Guarantees, and why ours over imports"
    />
  );
}
