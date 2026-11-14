import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';
import { changePassword, startTwoFactor, turnOffTwoFactor, turnOnTwoFactor } from '../actions';
import type { StaffArea, TwoFactorSetup } from '../session.server';
import { Notice } from './Notice';
import { PageHeader } from './PageHeader';
import styles from './Staff.module.css';

interface Props {
  area: StaffArea;
  me: { name: string; email: string; twoFactor: boolean };
  setup: TwoFactorSetup | null;
  message?: string;
  error?: string;
}

// The key in groups of four, which is easier to type into an app by hand.
const grouped = (secret: string) => secret.match(/.{1,4}/g)?.join(' ') ?? secret;

const CodeField = () => (
  <TextField
    label="Code from your authenticator app"
    name="code"
    inputMode="numeric"
    autoComplete="one-time-code"
    isRequired
  />
);

export function AccountPage({ area, me, setup, message, error }: Props) {
  return (
    <>
      <PageHeader
        title="Your account"
        description="Keep your password strong and turn on two-factor sign-in."
        meta={
          <span>
            {me.name} · {me.email}
          </span>
        }
      />
      <Notice message={message} error={error} />
      <div className={styles.narrow}>
        <section className={`${styles.panel} ${styles.stack}`} aria-labelledby="two-factor">
          <h2 id="two-factor">Two-factor sign-in</h2>
          {me.twoFactor ? (
            <form action={turnOffTwoFactor} className={styles.stack}>
              <p role="status">
                On. You enter a code from your authenticator app each time you sign in.
              </p>
              <input type="hidden" name="area" value={area} />
              <CodeField />
              <div className={styles.actions}>
                <Button type="submit" variant="secondary">
                  Turn off two-factor
                </Button>
              </div>
            </form>
          ) : setup ? (
            <form action={turnOnTwoFactor} className={styles.stack}>
              <ol>
                <li>
                  Open an authenticator app on your phone (Google Authenticator, Microsoft
                  Authenticator or 1Password) and add an account.
                </li>
                <li>
                  Choose to enter a key, and type <strong>{grouped(setup.secret)}</strong>. On this
                  phone you can <a href={setup.uri}>open it in the app</a> instead.
                </li>
                <li>Enter the 6-digit code the app shows.</li>
              </ol>
              <input type="hidden" name="area" value={area} />
              <CodeField />
              <div className={styles.actions}>
                <Button type="submit">Turn on two-factor</Button>
              </div>
            </form>
          ) : (
            <form action={startTwoFactor} className={styles.stack}>
              <p>
                Off. With it on, someone who learns your password still can&apos;t sign in without
                your phone.
              </p>
              <input type="hidden" name="area" value={area} />
              <div className={styles.actions}>
                <Button type="submit">Set up two-factor</Button>
              </div>
            </form>
          )}
        </section>

        <form action={changePassword} className={`${styles.panel} ${styles.stack}`}>
          <h2>Change your password</h2>
          <input type="hidden" name="area" value={area} />
          <TextField
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            isRequired
          />
          <TextField
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            description="At least 10 characters"
            isRequired
          />
          <TextField
            label="New password again"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            isRequired
          />
          <div className={styles.actions}>
            <Button type="submit">Change password</Button>
          </div>
        </form>
      </div>
    </>
  );
}
