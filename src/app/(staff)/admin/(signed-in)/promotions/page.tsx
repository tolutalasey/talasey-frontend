import type { Metadata } from 'next';
import { PromotionsAdmin } from '@/features/admin';
import { NotAllowed, Notice, PageHeader, requireStaff, staffApi } from '@/features/staff';

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
      <PageHeader
        title="Promotions"
        description="Discount codes and sales, with when they start and end."
      />
      <Notice message={message} error={error} />
      <PromotionsAdmin promotions={promotions} now={new Date()} />
    </>
  );
}
