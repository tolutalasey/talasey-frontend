import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePage, previewContent, StoryPage } from '@/features/content';
import { PageHeader, staffApi, staffStyles as styles } from '@/features/staff';

export const metadata: Metadata = { title: 'Preview' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Preview({ params }: Props) {
  const { id } = await params;
  const { data: document } = await (
    await staffApi()
  ).GET('/content/documents/{id}', {
    params: { path: { id } },
  });
  if (!document) notFound();
  const preview = previewContent(document.type, document.draft);
  return (
    <>
      <PageHeader
        back={{ href: `/content/edit/${document.id}/`, label: 'Back to editing' }}
        eyebrow="Preview"
        title={document.title}
        description="This is the draft. Shoppers don’t see it until it is published."
      />
      {preview.kind === 'guide' && <GuidePage guide={preview.guide} products={[]} />}
      {preview.kind === 'page' && (
        <StoryPage
          page={preview.page}
          breadcrumbs={[]}
          ranges={[]}
          products={[]}
          productsHeading="Products"
          pointsHeading="Why choose it"
        />
      )}
      {preview.kind === 'not-ready' && (
        <div className={styles.problem}>
          <strong>Fill these in to see a preview:</strong>
          <ul>
            {preview.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}
      {preview.kind === 'no-template' && (
        <p>This type of content shows inside other pages, so there is no page to preview.</p>
      )}
    </>
  );
}
