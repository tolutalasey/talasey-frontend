import type { Metadata } from 'next';
import { SkuChecks } from '@/features/admin';
import { NotAllowed, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'SKU checks' };

export default async function SkuChecksPage() {
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  const { data: problems = [] } = await (await staffApi()).GET('/admin/catalogue/sku-checks');
  return (
    <>
      <h1>SKU checks</h1>
      <p>
        Every option needs its own SKU, colours from a colour set never make a SKU, and product
        codes stay out of names.
      </p>
      <SkuChecks problems={problems} />
    </>
  );
}
