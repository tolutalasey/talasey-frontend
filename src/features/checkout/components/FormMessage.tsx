import styles from './Checkout.module.css';

export function FormMessage({ message }: { message?: string }) {
  return (
    <p role="alert" className={styles.alert} hidden={!message}>
      {message}
    </p>
  );
}
