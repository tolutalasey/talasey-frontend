import { continueSignIn } from '../actions';
import styles from './Account.module.css';

// The link in the email opens this page. Signing in takes a press of the button, so an email
// scanner that opens links on its own cannot use up the link first.
export function ContinueSignIn({ token }: { token: string }) {
  return (
    <div className={styles.signIn}>
      <section
        className={`frame ${styles.signInCard} ${styles.continue}`}
        aria-labelledby="continue-title"
      >
        <p className="eyebrow">Your account</p>
        <h1 id="continue-title">Welcome back</h1>
        <p className={styles.muted}>One more step to see your orders and samples.</p>
        <form action={continueSignIn}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className="button">
            Continue to your account
          </button>
        </form>
      </section>
    </div>
  );
}
