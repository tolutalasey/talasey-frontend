'use client';

import { useState, type FormEvent, type RefObject } from 'react';
import { ChatIcon, SendIcon } from '@/ui/icons';
import { cx } from '@/ui/cx';
import { ASSISTANT_NAME } from '../greeting';
import { MAX_MESSAGE_CHARS } from '../use-chat';
import styles from './Assistant.module.css';

interface Props {
  onOpen: () => void;
  onAsk: (text: string) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

// Closed state: a message box to start typing straight away, and the round chat button.
export function Launcher({ onOpen, onAsk, buttonRef }: Props) {
  const [text, setText] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim()) onAsk(text);
    else onOpen();
  };

  return (
    <div className={styles.launcher}>
      <form className={styles.pill} onSubmit={submit}>
        <label>
          <span className={styles.hidden}>Message {ASSISTANT_NAME}</span>
          <input
            type="text"
            value={text}
            maxLength={MAX_MESSAGE_CHARS}
            placeholder="Write a message…"
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <button
          type="submit"
          className={cx(styles.send, text.trim() && styles.sendReady)}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </form>
      <button
        ref={buttonRef}
        type="button"
        className={styles.chatButton}
        onClick={onOpen}
        aria-label={`Chat with ${ASSISTANT_NAME}`}
      >
        <ChatIcon width={26} height={26} />
      </button>
    </div>
  );
}
