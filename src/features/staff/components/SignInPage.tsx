import Image from 'next/image';
import NextLink from 'next/link';
import { signIn, signInWithCode } from '../actions';
import type { StaffArea } from '../session.server';
import { AlertCircleIcon, ChevronLeftIcon, KeyIcon, LockIcon, MailIcon } from './icons';
import { PasswordInput } from './PasswordInput';
import styles from './SignIn.module.css';

interface Props {
  area: StaffArea;
  title: string;
  next?: string;
  error?: string;
  step?: string;
}

const PITCH: Record<StaffArea, { heading: string; points: string[] }> = {
  admin: {
    heading: 'Orders, products and delivery, all in one place.',
    points: ['Take and track orders', 'Keep prices and stock right', 'Plan pallet days'],
  },
  content: {
    heading: 'Pages, guides and wording for the shop.',
    points: ['Save drafts as you go', 'Preview before it goes live', 'Publish on your schedule'],
  },
};

export function SignInPage({ area, title, next, error, step }: Props) {
  const askForCode = step === 'code';
  const pitch = PITCH[area];
  return (
    <main id="main" className={styles.page}>
      <section className={styles.brand} aria-hidden="true">
        <Image
          src="/images/brand/hero-pergola-patio.jpg"
          alt=""
          fill
          sizes="(min-width: 64rem) 50vw, 0px"
          className={styles.photo}
          priority
        />
        <div className={styles.brandInner}>
          <Image
            src="/images/brand/talasey-logo-on-dark.png"
            alt=""
            width={900}
            height={212}
            className={styles.brandLogo}
          />
          <div className={styles.pitch}>
            <p className={styles.eyebrow}>{title}</p>
            <p className={styles.heading}>{pitch.heading}</p>
            <ul className={styles.points}>
              {pitch.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.formSide}>
        <form action={askForCode ? signInWithCode : signIn} className={styles.form}>
          <Image
            src="/images/brand/talasey-logo.png"
            alt="Talasey"
            width={900}
            height={212}
            className={styles.formLogo}
          />
          <div className={styles.intro}>
            {askForCode && <p className={styles.step}>Step 2 of 2</p>}
            <h1 className={styles.title}>
              {askForCode ? 'Check your authenticator' : 'Welcome back'}
            </h1>
            <p className={styles.lead}>
              {askForCode
                ? 'Enter the 6-digit code your authenticator app shows for Talasey.'
                : `Sign in to ${title.replace('Talasey ', 'the ')} with your staff account.`}
            </p>
          </div>

          {error && (
            <div role="alert" className={styles.error}>
              <AlertCircleIcon />
              <p>{error}</p>
            </div>
          )}

          <input type="hidden" name="area" value={area} />
          {next && <input type="hidden" name="next" value={next} />}

          {askForCode ? (
            <div className={styles.field}>
              <label htmlFor="code" className={styles.label}>
                Code
              </label>
              <div className={styles.control}>
                <KeyIcon className={styles.icon} />
                <input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9 ]*"
                  maxLength={7}
                  required
                  autoFocus
                  className={`${styles.input} ${styles.code}`}
                  aria-describedby="code-hint"
                />
              </div>
              <p id="code-hint" className={styles.hint}>
                It changes every 30 seconds.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <div className={styles.control}>
                  <MailIcon className={styles.icon} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="name@talasey.co.uk"
                    required
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.control}>
                  <LockIcon className={styles.icon} />
                  <PasswordInput id="password" />
                </div>
              </div>
            </>
          )}

          <button type="submit" className={styles.submit}>
            {askForCode ? 'Verify and continue' : 'Sign in'}
          </button>

          {askForCode ? (
            <NextLink href={`/${area}/sign-in/`} className={styles.back}>
              <ChevronLeftIcon />
              Use a different account
            </NextLink>
          ) : (
            <p className={styles.help}>
              Forgotten your password? Ask the owner to reset it from the Staff page.
            </p>
          )}
        </form>
        <p className={styles.footnote}>Staff only. Every change is recorded in the change log.</p>
      </section>
    </main>
  );
}
