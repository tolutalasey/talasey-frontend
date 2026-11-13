import type { Metadata } from 'next';
import { CatalogueTransfer } from '@/features/admin';
import { NotAllowed, requireStaff } from '@/features/staff';

export const metadata: Metadata = { title: 'Import and export' };

export default async function CatalogueImportExport() {
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  return (
    <>
      <h1>Import and export</h1>
      <CatalogueTransfer />
    </>
  );
}
