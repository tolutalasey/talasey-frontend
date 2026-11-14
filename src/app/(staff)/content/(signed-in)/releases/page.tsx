import type { Metadata } from 'next';
import { connection } from 'next/server';
import { NewReleaseForm, ReleaseList } from '@/features/content-editor';
import {
  CreateMenu,
  NotAllowed,
  Notice,
  PageHeader,
  requireStaff,
  staffApi,
} from '@/features/staff';

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
      <PageHeader
        back={{ href: '/content/', label: 'Content' }}
        title="Releases"
        description="A release puts several changes live at the same moment, like a sale’s pages and questions. Everything in it publishes together, or nothing does."
        actions={
          <CreateMenu label="New release">
            <NewReleaseForm />
          </CreateMenu>
        }
      />
      <Notice message={message} error={error} />
      <ReleaseList releases={releases} now={new Date()} />
    </>
  );
}
