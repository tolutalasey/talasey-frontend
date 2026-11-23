import type { AssistantProductCard } from '@/api-client';

export interface Turn {
  role: 'visitor' | 'assistant';
  text: string;
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
