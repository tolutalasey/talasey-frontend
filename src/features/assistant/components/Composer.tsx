'use client';

import { useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { SendIcon } from '@/ui/icons';
import { cx } from '@/ui/cx';
import { MAX_MESSAGE_CHARS } from '../use-chat';
import styles from './Assistant.module.css';

interface Props {
  onSend: (text: string) => void;
  busy: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

// The message box at the foot of the panel. Enter sends; Shift+Enter starts a new line.
export function Composer({ onSend, busy, inputRef }: Props) {
  const [text, setText] = useState('');
  const ready = text.trim().length > 0 && !busy;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!ready) return;
    onSend(text);
    setText('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
  };

  return (
    <form className={styles.composer} onSubmit={submit}>
      <label className={styles.composerField}>
        <span className={styles.hidden}>Your message</span>
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          maxLength={MAX_MESSAGE_CHARS}
          placeholder="Write a message…"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </label>
      <button
        type="submit"
        className={cx(styles.send, ready && styles.sendReady)}
        disabled={!ready}
        aria-label="Send"
      >
        <SendIcon />
      </button>
    </form>
  );
}
