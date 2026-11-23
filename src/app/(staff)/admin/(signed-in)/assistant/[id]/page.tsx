import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AssistantTranscript } from '@/features/admin';
import {
  NotAllowed,
  PageHeader,
  requireStaff,
  staffApi,
  staffStyles as styles,
} from '@/features/staff';

export const metadata: Metadata = { title: 'Conversation' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AssistantConversation({ params }: Props) {
  const { id } = await params;
  if (!(await requireStaff('admin', 'enquiries')).allowed) return <NotAllowed />;
  const { data: exchanges } = await (
    await staffApi()
  ).GET('/admin/assistant/conversations/{id}', { params: { path: { id } } });
  if (!exchanges) notFound();
  return (
    <>
      <PageHeader
        back={{ href: '/admin/assistant/', label: 'Site assistant' }}
        title="Conversation"
      />
      <section className={styles.panel}>
        <AssistantTranscript exchanges={exchanges} />
      </section>
    </>
  );
}
