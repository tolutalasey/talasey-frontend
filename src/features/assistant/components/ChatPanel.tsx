'use client';

import { useEffect, useRef, useState } from 'react';
import { CloseIcon, ExpandIcon, RestartIcon, ShrinkIcon } from '@/ui/icons';
import { cx } from '@/ui/cx';
import type { Turn } from '../conversation';
import type { ChosenPhoto } from '../photo';
import { ASSISTANT_NAME, greeting, STARTERS } from '../greeting';
import styles from './Assistant.module.css';
import { Composer } from './Composer';
import { MessageText } from './MessageText';
import { ProductCards } from './ProductCards';
import { TalaAvatar } from './TalaAvatar';

interface Props {
  turns: Turn[];
  waiting: boolean;
  onSend: (text: string, photo?: ChosenPhoto) => void;
  onRestart: () => void;
  onClose: () => void;
}

export function ChatPanel({ turns, waiting, onSend, onRestart, onClose }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hello] = useState(() => greeting(new Date().getHours()));
  const input = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [turns, waiting]);

  return (
    <section
      className={cx(styles.panel, expanded && styles.panelExpanded)}
      role="dialog"
      aria-label={`Chat with ${ASSISTANT_NAME}`}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <div className={styles.toolbar}>
        <button
          type="button"
          className={cx(styles.round, styles.expand)}
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? 'Make the chat smaller' : 'Make the chat bigger'}
        >
          {expanded ? <ShrinkIcon /> : <ExpandIcon />}
        </button>
        <div className={styles.toolbarEnd}>
          <button
            type="button"
            className={styles.round}
            onClick={onRestart}
            disabled={turns.length === 0 || waiting}
            aria-label="Start a new chat"
            title="Start a new chat"
          >
            <RestartIcon />
          </button>
          <button
            type="button"
            className={styles.round}
            onClick={onClose}
            aria-label="Close the chat"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className={styles.identity}>
        <TalaAvatar size="large" online />
        <span>
          <strong>{ASSISTANT_NAME}</strong>
          <span>Talasey assistant</span>
        </span>
      </div>

      <div className={styles.messages} aria-live="polite">
        <div className={styles.fromTala}>
          <TalaAvatar />
          <div className={styles.text}>
            <p>{hello}</p>
          </div>
        </div>
        {turns.length === 0 && (
          <div className={styles.starters}>
            {STARTERS.map((starter) => (
              <button key={starter} type="button" onClick={() => onSend(starter)}>
                {starter}
              </button>
            ))}
          </div>
        )}
        {turns.map((turn, index) =>
          turn.role === 'visitor' ? (
            <div key={index} className={styles.fromVisitor}>
              {turn.photo && (
                // eslint-disable-next-line @next/next/no-img-element -- the visitor's own photo
                <img src={turn.photo} alt="Photo you sent" className={styles.sentPhoto} />
              )}
              <p>{turn.text}</p>
            </div>
          ) : (
            <div key={index} className={styles.fromTala}>
              <TalaAvatar />
              <div className={styles.text}>
                <MessageText text={turn.text} />
                {turn.products && <ProductCards products={turn.products} />}
              </div>
            </div>
          ),
        )}
        {waiting && (
          <div className={styles.fromTala}>
            <TalaAvatar />
            <span className={styles.typing} role="status">
              <span />
              <span />
              <span />
              <span className={styles.hidden}>{ASSISTANT_NAME} is typing</span>
            </span>
          </div>
        )}
        <div ref={end} />
      </div>

      <Composer onSend={onSend} busy={waiting} inputRef={input} />
      <p className={styles.note}>
        {ASSISTANT_NAME} can make mistakes. Check prices and details on the product page.
      </p>
    </section>
  );
}
