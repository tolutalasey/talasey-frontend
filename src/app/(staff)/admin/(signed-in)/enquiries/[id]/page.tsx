import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ENQUIRY_STATUS, ENQUIRY_TITLE, EnquiryDetail } from '@/features/admin';
import { Badge, NotAllowed, Notice, PageHeader, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Enquiry' };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function EnquiryPage({ params, searchParams }: Props) {
  const [{ id }, { message, error }] = await Promise.all([params, searchParams]);
  if (!(await requireStaff('admin', 'enquiries')).allowed) return <NotAllowed />;
  const { data: enquiry } = await (
    await staffApi()
  ).GET('/admin/enquiries/{id}', { params: { path: { id } } });
  if (!enquiry) notFound();
  const status = ENQUIRY_STATUS[enquiry.status];
  return (
    <>
      <PageHeader
        back={{ href: '/admin/enquiries/', label: 'Enquiries' }}
        title={ENQUIRY_TITLE[enquiry.kind]}
        meta={<Badge tone={status.tone}>{status.label}</Badge>}
      />
      <Notice message={message} error={error} />
      <EnquiryDetail enquiry={enquiry} />
    </>
  );
}
