'use server';

import { addBuildToBasket } from '@/features/checkout';
import type { BuildPart } from './rules';

export async function addPergolaToBasket(parts: BuildPart[]) {
  return addBuildToBasket(parts);
}
