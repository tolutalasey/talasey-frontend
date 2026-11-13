import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ColourSetEditor } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Edit colour set' };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function EditColourSet({ params, searchParams }: Props) {
  const [{ id }, { message, error }] = await Promise.all([params, searchParams]);
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: set } = await (
    await staffApi()
  ).GET('/admin/colour-sets/{id}', {
    params: { path: { id } },
  });
  if (!set) notFound();
  return (
    <>
      <h1>{set.name}</h1>
      <Notice message={message} error={error} />
      <ColourSetEditor set={set} />
    </>
  );
}
