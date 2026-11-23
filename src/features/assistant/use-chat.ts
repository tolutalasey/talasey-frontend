'use client';

import { useCallback, useState } from 'react';
import { loadTurns, saveTurns, type Turn } from './conversation';

const MAX_SENT_TURNS = 30;
export const MAX_MESSAGE_CHARS = 2000;

const FAILURES: Record<number, string> = {
  429: "You've sent a lot of messages in a short time. Please try again in a little while, or call us on 0330 333 8030.",
};
const FAILED =
  "Sorry, I couldn't answer just now. Please try again, or [contact the team](/contact/) on 0330 333 8030.";

type Answer = { text: string; failed?: boolean };

async function ask(turns: Turn[]): Promise<Answer> {
  const response = await fetch('/api/assistant/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      turns: turns
        .filter((turn) => !turn.failed)
        .slice(-MAX_SENT_TURNS)
        .map(({ role, text }) => ({ role, text })),
      page: window.location.pathname,
      pageTitle: document.title.slice(0, 300),
    }),
  });
  if (!response.ok) return { text: FAILURES[response.status] ?? FAILED, failed: true };
  const body = (await response.json()) as { reply?: string };
  return body.reply ? { text: body.reply } : { text: FAILED, failed: true };
}

export function useChat() {
  const [turns, setTurns] = useState<Turn[]>(loadTurns);
  const [waiting, setWaiting] = useState(false);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!message || waiting) return;
      const asked: Turn[] = [...turns, { role: 'visitor', text: message }];
      setTurns(asked);
      saveTurns(asked);
      setWaiting(true);
      const reply = await ask(asked).catch(() => ({ text: FAILED, failed: true }));
      const answered: Turn[] = [...asked, { role: 'assistant', ...reply }];
      setTurns(answered);
      saveTurns(answered);
      setWaiting(false);
    },
    [turns, waiting],
  );

  const restart = useCallback(() => {
    setTurns([]);
    saveTurns([]);
  }, []);

  return { turns, waiting, send, restart };
}
