import type { Metadata } from 'next';
import { brandPagePath, getBrandPages, IndexPage } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Our brands: Vitripiazza, Piranha, Pavetuf | Talasey',
  description:
    'The Talasey brands: Vitripiazza porcelain, Natural Paving stone, Piranha composites, Pavetuf jointing and care, and Luxigraze.',
  path: '/brands/',
});

export default async function Brands() {
  const brands = await getBrandPages();
  return (
    <IndexPage
      h1="Our brands"
      intro="The ranges we make and stand behind."
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Brands', path: '/brands/' },
      ]}
      items={brands.map((brand) => ({
        href: brandPagePath(brand),
        title: brand.name,
        text: brand.intro,
      }))}
    />
  );
}
