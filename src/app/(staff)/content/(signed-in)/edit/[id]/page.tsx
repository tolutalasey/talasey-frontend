import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentEditor } from '@/features/content-editor';
import { Notice, staffApi } from '@/features/staff';
import { contentTypes } from '../../types.server';

export const metadata: Metadata = { title: 'Edit content' };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function EditContent({ params, searchParams }: Props) {
  const [{ id }, { message, error }] = await Promise.all([params, searchParams]);
  const { data: document } = await (
    await staffApi()
  ).GET('/content/documents/{id}', {
    params: { path: { id } },
  });
  const type = (await contentTypes()).find((entry) => entry.type === document?.type);
  if (!document || !type) notFound();
  const { data: releases = [] } = type.canPublish
    ? await (await staffApi()).GET('/content/releases')
    : { data: [] };
  return (
    <>
      <h1>
        {type.label}: {document.title}
      </h1>
      <Notice message={message} error={error} />
      <ContentEditor
        document={document}
        type={type}
        releases={releases.filter((release) => release.status !== 'published')}
      />
    </>
  );
}
