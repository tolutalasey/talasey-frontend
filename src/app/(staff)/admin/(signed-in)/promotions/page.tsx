import type { Metadata } from 'next';
import { PromotionsAdmin } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Promotions' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function Promotions({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: promotions = [] } = await (await staffApi()).GET('/admin/promotions');
  return (
    <>
      <h1>Promotions</h1>
      <Notice message={message} error={error} />
      <PromotionsAdmin promotions={promotions} now={new Date()} />
    </>
  );
}
