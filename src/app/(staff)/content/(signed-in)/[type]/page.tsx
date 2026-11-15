import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ContentList,
  NewContentForm,
  typeMeta,
  unsavedEntries,
  type ContentView,
} from '@/features/content-editor';
import { Badge, CreateMenu, Notice, PageHeader, staffApi } from '@/features/staff';
import { contentTypes } from '../types.server';

export const metadata: Metadata = { title: 'Content' };

const VIEWS: ContentView[] = ['all', 'published', 'changed', 'draft'];

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ show?: string; message?: string; error?: string }>;
}

export default async function ContentOfType({ params, searchParams }: Props) {
  const [{ type: name }, { show, message, error }] = await Promise.all([params, searchParams]);
  const type = (await contentTypes()).find((entry) => entry.type === name);
  if (!type) notFound();
  const view = VIEWS.find((entry) => entry === show) ?? 'all';
  const { data: documents = [] } = await (
    await staffApi()
  ).GET('/content/documents', {
    params: { query: { type: name } },
  });
  const unsaved =
    type.singleton && documents.length > 0
      ? []
      : unsavedEntries(
          type.type,
          documents.map((document) => document.key),
        );
  const canAdd = !type.singleton || (documents.length === 0 && unsaved.length === 0);
  return (
    <>
      <PageHeader
        back={{ href: '/content/', label: 'Content' }}
        title={type.label}
        description={typeMeta(type.type).text}
        meta={type.locked && <Badge tone="brand">Only the owner publishes this</Badge>}
        actions={
          canAdd &&
          documents.length + unsaved.length > 0 && (
            <CreateMenu label="New entry">
              <NewContentForm type={type} />
            </CreateMenu>
          )
        }
      />
      <Notice message={message} error={error} />
      <ContentList type={type} documents={documents} unsaved={unsaved} view={view} />
    </>
  );
}
