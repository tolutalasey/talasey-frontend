import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ReleaseList } from '@/features/content-editor';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Releases' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function Releases({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('content', 'content.publish')).allowed) return <NotAllowed />;
  await connection();
  const { data: releases = [] } = await (await staffApi()).GET('/content/releases');
  return (
    <>
      <h1>Releases</h1>
      <Notice message={message} error={error} />
      <ReleaseList releases={releases} now={new Date()} />
    </>
  );
}
