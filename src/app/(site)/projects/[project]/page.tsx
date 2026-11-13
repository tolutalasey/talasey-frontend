import type { Metadata } from 'next';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectPages, getProjectView, projectPath, StoryPage } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/projects/[project]'>;

export async function generateStaticParams() {
  return (await getProjectPages()).map((project) => ({ project: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const view = await getProjectView((await params).project);
  if (!view) notFound();
  return pageMetadata({
    ...view.page.seo,
    path: projectPath(view.page),
    noindex: view.page.placeholder,
  });
}

export default async function Project({ params }: Props) {
  const view = await getProjectView((await params).project);
  if (!view) notFound();
  const { page } = view;
  return (
    <StoryPage
      {...view}
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
