import type { Metadata } from 'next';
import { ColourSetEditor, ColourSetList } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Colour sets' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function ColourSets({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: sets = [] } = await (await staffApi()).GET('/admin/colour-sets');
  return (
    <>
      <h1>Colour sets</h1>
      <Notice message={message} error={error} />
      <ColourSetList sets={sets} />
      <h2>Add a colour set</h2>
      <ColourSetEditor />
    </>
  );
}
