import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectPages, getProjectView, ProjectStory, projectPath } from '@/features/content';
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
  return <ProjectStory {...view} />;
}
