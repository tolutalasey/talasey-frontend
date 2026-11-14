import Image from 'next/image';
import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';
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
    <main id="main" className={styles.signInPage}>
      <form action={askForCode ? signInWithCode : signIn} className={styles.signIn}>
        <Image
          className={styles.signInLogo}
          src="/images/brand/talasey-logo.png"
          alt=""
          width={900}
          height={212}
          priority
        />
        <h1 className={styles.signInTitle}>{title}</h1>
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
