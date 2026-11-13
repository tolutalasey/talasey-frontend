import { Button, TextField } from '@/ui';
import { signIn } from '../actions';
import type { StaffArea } from '../session.server';
import { Notice } from './Notice';
import styles from './Staff.module.css';

interface Props {
  area: StaffArea;
  title: string;
  next?: string;
  error?: string;
}

export function SignInPage({ area, title, next, error }: Props) {
  return (
    <main id="main" className={styles.shell}>
      <form action={signIn} className={styles.signIn}>
        <h1>{title}</h1>
        <Notice error={error} />
        <input type="hidden" name="area" value={area} />
        {next && <input type="hidden" name="next" value={next} />}
        <TextField label="Email" name="email" type="email" autoComplete="username" isRequired />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          isRequired
        />
        <Button type="submit">Sign in</Button>
      </form>
    </main>
  );
}
