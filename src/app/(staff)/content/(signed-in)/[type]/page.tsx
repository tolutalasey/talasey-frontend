import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentList } from '@/features/content-editor';
import { Notice, staffApi } from '@/features/staff';
import { contentTypes } from '../types.server';

export const metadata: Metadata = { title: 'Content' };

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function ContentOfType({ params, searchParams }: Props) {
  const [{ type: name }, { message, error }] = await Promise.all([params, searchParams]);
  const type = (await contentTypes()).find((entry) => entry.type === name);
  if (!type) notFound();
  const { data: documents = [] } = await (
    await staffApi()
  ).GET('/content/documents', {
    params: { query: { type: name } },
  });
  return (
    <>
      <h1>{type.label}</h1>
      <Notice message={message} error={error} />
      <ContentList type={type} documents={documents} />
    </>
  );
}
