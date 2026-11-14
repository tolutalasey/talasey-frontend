import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CONTENT_STATUS, ContentEditor } from '@/features/content-editor';
import { Badge, Notice, PageHeader, staffApi } from '@/features/staff';
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
  const status = CONTENT_STATUS[document.status];
  return (
    <>
      <PageHeader
        back={{ href: `/content/${type.type}/`, label: type.label }}
        title={document.title}
        meta={<Badge tone={status.tone}>{status.label}</Badge>}
      />
      <Notice message={message} error={error} />
      <ContentEditor
        document={document}
        type={type}
        releases={releases.filter((release) => release.status !== 'published')}
      />
    </>
  );
}
