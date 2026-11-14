import type { FormState } from '@/lib/form-feedback';

// Reads ?again=added-asked from "Buy again" into the notice the bag shows.
export function buyAgainFeedback(value: unknown): FormState | undefined {
  const match = typeof value === 'string' ? /^(\d+)-(\d+)$/.exec(value) : null;
  if (!match) return undefined;
  const added = Number(match[1]);
  const asked = Number(match[2]);
  if (added === asked) {
    return { notice: `Added ${added} ${added === 1 ? 'item' : 'items'} from your earlier order.` };
  }
  return {
    message: `Added ${added} of ${asked} items. The others are no longer sold as they were.`,
  };
}
