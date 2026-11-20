import type { Metadata } from 'next';
import { EnquiryList } from '@/features/admin';
import {
  NotAllowed,
  PageHeader,
  requireStaff,
  staffApi,
  staffStyles as styles,
} from '@/features/staff';

export const metadata: Metadata = { title: 'Enquiries' };

export default async function Enquiries() {
  if (!(await requireStaff('admin', 'enquiries')).allowed) return <NotAllowed />;
  const { data: enquiries = [] } = await (await staffApi()).GET('/admin/enquiries');
  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Contact form messages and site survey requests, newest first."
      />
      <section className={`${styles.panel} ${styles.flush}`}>
        <EnquiryList enquiries={enquiries} />
      </section>
    </>
  );
}
