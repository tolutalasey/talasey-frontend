import type { Metadata } from 'next';
import { ChangeLog } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Change log' };

interface Props {
  searchParams: Promise<{ subject?: string; subjectId?: string; message?: string; error?: string }>;
}

export default async function Log({ searchParams }: Props) {
  const { subject, subjectId, message, error } = await searchParams;
  if (!(await requireStaff('admin', 'audit')).allowed) return <NotAllowed />;
  const { data: entries = [] } = await (
    await staffApi()
  ).GET('/admin/audit', {
    params: { query: { subject, subjectId, limit: 100 } },
  });
  const back = `/admin/log/${subject ? `?subject=${subject}&subjectId=${subjectId ?? ''}` : ''}`;
  return (
    <>
      <h1>Change log</h1>
      <p>
        Every change staff make, newest first. &ldquo;Put back as before&rdquo; undoes one change
        and is logged too.
      </p>
      <Notice message={message} error={error} />
      <ChangeLog entries={entries} back={back} />
    </>
  );
}
