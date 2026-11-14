import type { Metadata } from 'next';
import { PageBreadcrumbs } from '@/features/layout';
import { ContactForm, ENQUIRY_TOPICS } from '@/features/contact';
import { readFeedback } from '@/lib/form-feedback.server';
import { pageMetadata } from '@/lib/seo';
import styles from './contact.module.css';

// Shows the form's errors without JavaScript, so it renders per request (ADR 0020).
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Contact Talasey: questions, quotes and samples',
  description:
    'Send us a question, ask for a quote or free samples, or share photos of your garden. We reply to every message.',
  path: '/contact/',
});

type Props = PageProps<'/contact'>;

export default async function Contact({ searchParams }: Props) {
  const asked = (await searchParams).topic;
  const topic = ENQUIRY_TOPICS.find((option) => option.value === asked)?.value;
  const feedback = await readFeedback();
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact us', path: '/contact/' },
        ]}
      />
      <div className={styles.layout}>
        <header className={styles.intro}>
          <p className="eyebrow">Help from our team</p>
          <h1>Contact us</h1>
          <p>Ask a question, request free samples or a quote, or send photos of your project.</p>
        </header>
        <div className={`frame ${styles.formFrame}`}>
          <ContactForm topic={topic} initialState={feedback.contact} />
        </div>
      </div>
    </article>
  );
}
