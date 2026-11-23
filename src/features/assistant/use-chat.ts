'use client';

import { useCallback, useState } from 'react';
import { conversationId, loadTurns, saveTurns, type Turn } from './conversation';
import { uploadPhoto, type ChosenPhoto } from './photo';

const MAX_SENT_TURNS = 30;
export const MAX_MESSAGE_CHARS = 2000;

const FAILURES: Record<number, string> = {
  429: "You've sent a lot of messages in a short time. Please try again in a little while, or call us on 0330 333 8030.",
};
const PHOTO_TEXT = "Here's a photo of my garden.";
const PHOTO_FAILED =
  "Sorry, that photo didn't upload. Try again, or send a smaller one as a JPEG or PNG.";
const FAILED =
  "Sorry, I couldn't answer just now. Please try again, or [contact the team](/contact/) on 0330 333 8030.";

type Answer = Pick<Turn, 'text' | 'failed' | 'products'>;

async function ask(turns: Turn[]): Promise<Answer> {
  const response = await fetch('/api/assistant/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      conversationId: conversationId(),
      turns: turns
        .filter((turn) => !turn.failed)
        .slice(-MAX_SENT_TURNS)
        .map(({ role, text, photoId }) => ({ role, text, photoId })),
      page: window.location.pathname,
      pageTitle: document.title.slice(0, 300),
    }),
  });
  if (!response.ok) return { text: FAILURES[response.status] ?? FAILED, failed: true };
  const body = (await response.json()) as { reply?: string; products?: Turn['products'] };
  return body.reply
    ? { text: body.reply, products: body.products?.length ? body.products : undefined }
    : { text: FAILED, failed: true };
}

export function useChat() {
  const [turns, setTurns] = useState<Turn[]>(loadTurns);
  const [waiting, setWaiting] = useState(false);

  const send = useCallback(
    async (text: string, photo?: ChosenPhoto) => {
      const message = text.trim().slice(0, MAX_MESSAGE_CHARS) || (photo ? PHOTO_TEXT : '');
      if (!message || waiting) return;
      const visitor: Turn = {
        role: 'visitor',
        text: message,
        ...(photo && { photo: photo.thumb }),
      };
      let asked: Turn[] = [...turns, visitor];
      setTurns(asked);
      setWaiting(true);
      const answer = async (): Promise<Pick<Turn, 'text' | 'failed' | 'products'>> => {
        if (photo) {
          const photoId = await uploadPhoto(photo.blob).catch(() => null);
          if (!photoId) return { text: PHOTO_FAILED, failed: true };
          asked = [...turns, { ...visitor, photoId }];
        }
        return ask(asked).catch(() => ({ text: FAILED, failed: true }));
      };
      const reply = await answer();
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
    conversationId(true);
  }, []);

  return { turns, waiting, send, restart };
}
