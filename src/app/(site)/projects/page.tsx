import type { Metadata } from 'next';
import { getProjectPages, IndexPage, projectPath } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Garden projects: patios, decks and more | Talasey',
  description:
    'Plan a new patio, a composite deck, shade and shelter or a garden room: what each involves and the products that suit.',
  path: '/projects/',
});

export default async function Projects() {
  const projects = await getProjectPages();
  return (
    <IndexPage
      h1="What are you planning?"
      intro="What each project involves, and the products that suit it."
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects/' },
      ]}
      items={projects.map((project) => ({
        href: projectPath(project),
        title: project.name,
        text: project.intro,
      }))}
    />
  );
}
