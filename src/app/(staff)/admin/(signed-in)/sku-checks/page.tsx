import type { Metadata } from 'next';
import { SkuChecks } from '@/features/admin';
import { NotAllowed, PageHeader, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'SKU checks' };

export default async function SkuChecksPage() {
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: problems = [] } = await (await staffApi()).GET('/admin/catalogue/sku-checks');
  return (
    <>
      <PageHeader
        title="SKU checks"
        description="Every option needs its own SKU, colours from a colour set never make a SKU, and product codes stay out of names."
      />
      <SkuChecks problems={problems} />
    </>
  );
}
