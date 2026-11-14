import type { FormState } from '@/lib/form-feedback';
import { requestSignInLink } from '../actions';
import styles from './Account.module.css';

// No password: we email a link that signs the customer in to see their orders and samples.
export function SignInPage({ feedback }: { feedback?: FormState }) {
  const sent = feedback?.notice === 'sent';
  const email = feedback?.values?.email ?? '';
  const problem = feedback?.fieldErrors?.email;

  return (
    <div className={styles.signIn}>
      <div className={styles.signInIntro}>
        <p className="eyebrow">Your account</p>
        <h1>See your orders and samples</h1>
        <p>
          No password to remember. Enter the email you ordered with and we send you a link to sign
          in.
        </p>
      </div>

      <section className={`frame ${styles.signInCard}`} aria-labelledby="sign-in-title">
        {sent ? (
          <div className={styles.sent} role="status">
            <span className={styles.envelope} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M3 6h18v12H3z" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <h2 id="sign-in-title">Check your email</h2>
            <p>
              If we have orders or samples for <strong>{email}</strong>, a link to sign in is on its
              way. It works once, for 20 minutes.
            </p>
            <p className={styles.muted}>Not there? Check your junk folder, or try again below.</p>
            <form action={requestSignInLink} className={styles.again}>
              <input type="hidden" name="email" value={email} />
              <button type="submit" className="chip">
                Send it again
              </button>
            </form>
          </div>
        ) : (
          <>
            <h2 id="sign-in-title">Sign in</h2>
            {feedback?.message && (
              <p role="alert" className={styles.alert}>
                {feedback.message}
              </p>
            )}
            <form action={requestSignInLink} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="account-email">Email</label>
                <input
                  id="account-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={email}
                  aria-invalid={problem ? true : undefined}
                  aria-describedby={problem ? 'account-email-problem' : undefined}
                  autoFocus={Boolean(problem)}
                />
                {problem && (
                  <p id="account-email-problem" className={styles.error}>
                    {problem}
                  </p>
                )}
              </div>
              <button type="submit" className="button">
                Email me a sign-in link
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
