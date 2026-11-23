'use server';

import { addVariantToBag } from '@/features/checkout';

export async function addToBagFromChat(variantId: string, quantity: number) {
  const result = await addVariantToBag(variantId, quantity);
  return { added: Boolean(result.added), message: result.message ?? null };
}
