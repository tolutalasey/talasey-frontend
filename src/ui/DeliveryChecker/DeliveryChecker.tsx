'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '../Button/Button';
import { cx } from '../cx';
import { AlertIcon, CheckIcon } from '../icons';
import { TextField } from '../TextField/TextField';
import styles from './DeliveryChecker.module.css';

export interface DeliveryResult {
  available: boolean;
  message: string;
}

export interface DeliveryCheckerProps {
  onCheck: (postcode: string) => void;
  result?: DeliveryResult;
  isPending?: boolean;
  defaultPostcode?: string;
}

export function DeliveryChecker({
  onCheck,
  result,
  isPending,
  defaultPostcode = '',
}: DeliveryCheckerProps) {
  const [postcode, setPostcode] = useState(defaultPostcode);

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCheck(postcode.trim());
  }

  return (
    <form className={styles.checker} onSubmit={check}>
      <div className={styles.row}>
        <TextField
          label="Your postcode"
          name="postcode"
          autoComplete="postal-code"
          value={postcode}
          onChange={setPostcode}
          isRequired
          className={styles.field}
        />
        <Button type="submit" variant="secondary" isPending={isPending}>
          Check delivery
        </Button>
      </div>
      <div role="status" className={styles.status}>
        {result && (
          <p className={cx(styles.result, result.available ? styles.ok : styles.problem)}>
            {result.available ? <CheckIcon /> : <AlertIcon />}
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}
