import NextLink from 'next/link';
import type { Range } from '@/features/catalogue';
import type { SearchRecord } from '@/features/search';
import { brandPagePath, projectPath } from '../paths';
import type { BrandPage, ProjectPage } from '../schemas';
import { StoryPage } from './StoryPage';

interface ViewProps<Page> {
  page: Page;
  ranges: Range[];
  products: SearchRecord[];
}

export function BrandStory({ page, ranges, products }: ViewProps<BrandPage>) {
  return (
    <StoryPage
      page={page}
      ranges={ranges}
      products={products}
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

export function ProjectStory({ page, ranges, products }: ViewProps<ProjectPage>) {
  return (
    <StoryPage
      page={page}
      ranges={ranges}
      products={products}
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects/' },
        { name: page.name, path: projectPath(page) },
      ]}
      productsHeading="Products that suit"
      pointsHeading="Good to know"
    >
      {page.steps.length > 0 && (
        <section aria-labelledby="involved-title">
          <h2 id="involved-title">What&rsquo;s involved</h2>
          <ol>
            {page.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}
      <section aria-labelledby="help-title">
        <h2 id="help-title">Plan it with us</h2>
        <p>
          The online project builder and installer search are on their way. Until then,{' '}
          <NextLink href="/contact/?topic=quote">send us your measurements and photos</NextLink> and
          we&rsquo;ll price it and suggest an installer near you.
        </p>
      </section>
    </StoryPage>
  );
}
