import type { Metadata } from 'next';
import { CatalogueTransfer } from '@/features/admin';
import { NotAllowed, PageHeader, requireStaff } from '@/features/staff';

export const metadata: Metadata = { title: 'Import and export' };

export default async function CatalogueImportExport() {
  if (!(await requireStaff('admin', 'catalogue')).allowed) return <NotAllowed />;
  return (
    <>
      <PageHeader
        title="Import and export"
        description="Download the catalogue as a spreadsheet, or upload one to change many products at once."
      />
      <CatalogueTransfer />
    </>
  );
}
