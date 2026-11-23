import type { Metadata } from 'next';
import {
  AssistantConversations,
  AssistantGaps,
  AssistantStats,
  AssistantSwitch,
} from '@/features/admin';
import {
  NotAllowed,
  Notice,
  PageHeader,
  requireStaff,
  staffApi,
  staffStyles as styles,
} from '@/features/staff';

export const metadata: Metadata = { title: 'Site assistant' };

const DAYS = 30;

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function AssistantAdmin({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('admin', 'enquiries')).allowed) return <NotAllowed />;
  const api = await staffApi();
  const query = { params: { query: { days: DAYS } } };
  const [status, usage, gaps, conversations] = await Promise.all([
    api.GET('/admin/assistant'),
    api.GET('/admin/assistant/usage', query),
    api.GET('/admin/assistant/gaps', query),
    api.GET('/admin/assistant/conversations', query),
  ]);
  return (
    <>
      <PageHeader
        title="Site assistant"
        description={`Tala, the chat in the corner of the site. Figures are for the last ${DAYS} days.`}
      />
      <Notice message={message} error={error} />
      {status.data && <AssistantSwitch status={status.data} />}
      {usage.data && <AssistantStats usage={usage.data} />}
      <div className={styles.sectionHead}>
        <h2>Couldn&apos;t answer</h2>
      </div>
      <section className={`${styles.panel} ${styles.flush}`}>
        <AssistantGaps gaps={gaps.data ?? []} />
      </section>
      <div className={styles.sectionHead}>
        <h2>Conversations</h2>
      </div>
      <section className={`${styles.panel} ${styles.flush}`}>
        <AssistantConversations conversations={conversations.data ?? []} />
      </section>
    </>
  );
}
