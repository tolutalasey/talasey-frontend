import type { Metadata } from 'next';
import { getSiteSettings, PageBreadcrumbs } from '@/features/layout';
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
  const [feedback, settings] = await Promise.all([readFeedback(), getSiteSettings()]);
  const address = settings.address?.split('\n').filter(Boolean) ?? [];
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
          <p className="eyebrow">Contact</p>
          <h1>Let&apos;s get your project grounded</h1>
          <p>
            Stone, porcelain, decking, or turf — whatever&apos;s going down, our team can talk
            specs, samples, and stockists before you commit to a single slab.
          </p>
          <dl className={styles.ways}>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${settings.contactPhone.replace(/[^\d+]/g, '')}`}>
                  {settings.contactPhone}
                </a>
              </dd>
            </div>
            {settings.contactEmail && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                </dd>
              </div>
            )}
            {address.length > 0 && (
              <div>
                <dt>Visit</dt>
                <dd>
                  {address.join(', ')}
                  <br />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.join(', '))}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Get directions
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </header>
        <div className={`frame ${styles.formFrame}`}>
          <h2 className={styles.formTitle}>Tell us what you&apos;re building</h2>
          <p className={styles.formIntro}>
            Trade account, homeowner project, or a technical question about a spec sheet — this goes
            straight to the right person on our team. A real reply from a real person, not a bot.
          </p>
          <ContactForm topic={topic} initialState={feedback.contact} />
        </div>
      </div>
    </article>
  );
}
