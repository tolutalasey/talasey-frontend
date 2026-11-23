'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '../use-chat';
import styles from './Assistant.module.css';
import { ChatPanel } from './ChatPanel';
import { Launcher } from './Launcher';

// Pages where the chat would sit on top of something more important.
const QUIET_PATHS = ['/checkout', '/order'];
// Pages with their own buy buttons in the corner, where only the round chat button shows.
const BUSY_PATHS = ['/products/'];
const OPEN_KEY = 'talasey:assistant-open';

function wasOpen(): boolean {
  try {
    return sessionStorage.getItem(OPEN_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberOpen(open: boolean) {
  try {
    if (open) sessionStorage.setItem(OPEN_KEY, '1');
    else sessionStorage.removeItem(OPEN_KEY);
  } catch {
    // Not remembered across pages; nothing else changes.
  }
}

// Tala, the site assistant, in the bottom-right corner. Shown only when the backend has it on.
export function Assistant() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(wasOpen);
  const chat = useChat();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch('/api/assistant/')
      .then((response) => response.json() as Promise<{ enabled?: boolean }>)
      .then((status) => setEnabled(status.enabled === true))
      .catch(() => setEnabled(false));
  }, []);

  const show = (value: boolean) => {
    setOpen(value);
    rememberOpen(value);
    if (!value) requestAnimationFrame(() => button.current?.focus());
  };

  if (!enabled || QUIET_PATHS.some((path) => pathname.startsWith(path))) return null;

  return (
    <div className={styles.root}>
      {open ? (
        <ChatPanel
          turns={chat.turns}
          waiting={chat.waiting}
          onSend={chat.send}
          onRestart={chat.restart}
          onClose={() => show(false)}
        />
      ) : (
        <Launcher
          buttonRef={button}
          compact={BUSY_PATHS.some((path) => pathname.startsWith(path))}
          onOpen={() => show(true)}
          onAsk={(text) => {
            show(true);
            void chat.send(text);
          }}
        />
      )}
    </div>
  );
}
