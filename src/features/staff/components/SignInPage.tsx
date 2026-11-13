import { Button, TextField } from '@/ui';
import { signIn, signInWithCode } from '../actions';
import type { StaffArea } from '../session.server';
import { Notice } from './Notice';
import styles from './Staff.module.css';

interface Props {
  area: StaffArea;
  title: string;
  next?: string;
  error?: string;
  step?: string;
}

export function SignInPage({ area, title, next, error, step }: Props) {
  const askForCode = step === 'code';
  return (
    <main id="main" className={styles.shell}>
      <form action={askForCode ? signInWithCode : signIn} className={styles.signIn}>
        <h1>{title}</h1>
        <Notice error={error} />
        <input type="hidden" name="area" value={area} />
        {next && <input type="hidden" name="next" value={next} />}
        {askForCode ? (
          <TextField
            label="Code from your authenticator app"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            description="6 digits. It changes every 30 seconds."
            isRequired
          />
        ) : (
          <>
            <TextField label="Email" name="email" type="email" autoComplete="username" isRequired />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              isRequired
            />
          </>
        )}
        <Button type="submit">{askForCode ? 'Continue' : 'Sign in'}</Button>
      </form>
    </main>
  );
}
