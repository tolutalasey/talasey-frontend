import type { Metadata } from 'next';
import { ColourSetEditor, ColourSetList } from '@/features/admin';
import { NotAllowed, Notice, PageHeader, requireStaff, staffApi } from '@/features/staff';

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
      <PageHeader
        title="Colour sets"
        description="The colours shoppers choose from on 1B products. One set can serve many products."
      />
      <Notice message={message} error={error} />
      <ColourSetList sets={sets} />
      <h2>Add a colour set</h2>
      <ColourSetEditor />
    </>
  );
}
