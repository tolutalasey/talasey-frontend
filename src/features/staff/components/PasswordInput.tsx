'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './icons';
import styles from './SignIn.module.css';

export function PasswordInput({ id }: { id: string }) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <input
        id={id}
        name="password"
        type={shown ? 'text' : 'password'}
        autoComplete="current-password"
        required
        className={styles.input}
      />
      <button
        type="button"
        className={styles.reveal}
        aria-pressed={shown}
        aria-controls={id}
        onClick={() => setShown((value) => !value)}
      >
        {shown ? <EyeOffIcon /> : <EyeIcon />}
        <span className={styles.revealLabel}>{shown ? 'Hide' : 'Show'}</span>
      </button>
    </>
  );
}
