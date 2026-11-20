'use server';

import { addBuildToBasket } from '@/features/checkout';
import { getFenceBuilder, getFenceCatalogue } from './loaders.server';
import { fenceChoiceSchema, fenceKit } from './rules';

// The kit is worked out again here from the shopper's choices, so the bag only ever gets the
// parts and amounts the rules give, whatever the page sent.
export async function addFenceKitToBasket(slug: string, choice: unknown) {
  const parsed = fenceChoiceSchema.safeParse(choice);
  const builder = typeof slug === 'string' ? await getFenceBuilder(slug) : null;
  if (!parsed.success || !builder) return { message: 'That fence could not be added. Try again.' };
  const kit = fenceKit(builder, await getFenceCatalogue(builder), parsed.data);
  if (!kit.ready) return { message: kit.problems.join('. ') };
  return addBuildToBasket(
    kit.lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity })),
  );
}
