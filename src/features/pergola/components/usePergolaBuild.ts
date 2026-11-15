'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { addPergolaToBasket } from '../actions';
import {
  emptyBuild,
  summarise,
  updateBuild,
  type Build,
  type Catalogue,
  type PergolaRules,
  type SideId,
  type Slat,
} from '../rules';

const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
export const pounds = (pence: number) => formatter.format(pence / 100);

// One build, shared by both builder designs: the choices, what they cost and adding them to the bag.
export function usePergolaBuild(rules: PergolaRules, catalogue: Catalogue) {
  const [build, setBuild] = useState<Build>(emptyBuild);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const summary = useMemo(() => summarise(rules, catalogue, build), [rules, catalogue, build]);

  const change = (update: Partial<Build>) => {
    setMessage(null);
    setBuild((current) => updateBuild(rules, current, update));
  };

  const chooseSide = (side: SideId, option: string | null) =>
    change({ sides: { ...build.sides, [side]: { option, slats: build.sides[side].slats } } });

  const chooseSlat = (side: SideId, index: number, slat: Slat) => {
    const slats = build.sides[side].slats.map((current, at) => (at === index ? slat : current));
    change({ sides: { ...build.sides, [side]: { ...build.sides[side], slats } } });
  };

  const addToBag = () =>
    startTransition(async () => {
      const result = await addPergolaToBasket(summary.parts);
      if (result?.message) setMessage(result.message);
      if (result?.added) router.push('/basket/', { scroll: false });
    });

  return { build, summary, change, chooseSide, chooseSlat, addToBag, pending, message };
}
