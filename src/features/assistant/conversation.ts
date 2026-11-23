import type { AssistantProductCard } from '@/api-client';

export interface Turn {
  role: 'visitor' | 'assistant';
  text: string;
  // A photo sent with the message: its id on the backend and a small copy to show here.
  photoId?: string;
  photo?: string;
  // Products the assistant picked to show as cards under its words.
  products?: AssistantProductCard[];
  // A reply that is only an apology for a failed request: shown, but never sent back.
  failed?: boolean;
}

const KEY = 'talasey:assistant';
const KEPT_TURNS = 30;

// The chat carries on across pages for the visit, and is gone when the tab closes.
export function loadTurns(): Turn[] {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? '[]');
    return Array.isArray(saved) ? (saved as Turn[]).filter(isTurn) : [];
  } catch {
    return [];
  }
}

export function saveTurns(turns: Turn[]): void {
  try {
    if (turns.length === 0) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, JSON.stringify(turns.slice(-KEPT_TURNS)));
  } catch {
    // Storage can be full or blocked; the chat still works for this page.
  }
}

function isTurn(value: unknown): value is Turn {
  const turn = value as Partial<Turn> | null;
  return (turn?.role === 'visitor' || turn?.role === 'assistant') && typeof turn.text === 'string';
}

const ID_KEY = 'talasey:assistant-conversation';

// One id per chat, so staff can read it back as one conversation. A new chat gets a new one.
export function conversationId(fresh = false): string {
  try {
    const saved = sessionStorage.getItem(ID_KEY);
    if (saved && !fresh) return saved;
    const id = crypto.randomUUID();
    sessionStorage.setItem(ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
