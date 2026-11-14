'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBasketClient } from '@/lib/commerce';
import { rememberBasket } from './basket-cookie.server';
import { completeBasket, currentBasketId, EXPIRED_MESSAGE } from './basket.server';
import { settle } from '@/lib/form-feedback.server';
import {
  DELIVERY_DETAIL_FIELDS,
  parseAccessAnswers,
  parseBasketRequest,
  parseDeliveryDetails,
  typedValues,
  type FormState,
} from './forms';

const EXPIRED: FormState = { message: EXPIRED_MESSAGE };

// Errors go back to the product page through the feedback cookie as well, so they show without
// JavaScript (ADR 0020).
export async function addToBasket(_state: FormState, form: FormData): Promise<FormState> {
  const typed = typedValues(form, ['quantity', 'area']);
  const request = parseBasketRequest(form);
  if (!request.ok) return settle('basket', { ...request.state, values: typed });
  const { variantId, quantity, colour, extras } = request.value;

  const client = getBasketClient();
  let basketId = await currentBasketId();
  if (!basketId) {
    basketId = (await client.create()).id;
    await rememberBasket(basketId);
  }

  const added = await client.addItem(basketId, variantId, quantity, colour ?? undefined);
  if (!added.ok) return settle('basket', { message: added.message, values: typed });
  for (const extra of extras) {
    const extraAdded = await client.addItem(basketId, extra, 1);
    if (!extraAdded.ok) return settle('basket', { message: extraAdded.message, values: typed });
  }
  await settle('basket', {});
  redirect('/basket/');
}

export async function saveDeliveryDetails(_state: FormState, form: FormData): Promise<FormState> {
  const basketId = await currentBasketId();
  if (!basketId) return settle('details', EXPIRED);
  const typed = typedValues(form, DELIVERY_DETAIL_FIELDS);
  const details = parseDeliveryDetails(form);
  if (!details.ok) return settle('details', { ...details.state, values: typed });

  const saved = await getBasketClient().setContact(
    basketId,
    details.value.email,
    details.value.address,
  );
  if (!saved.ok) return settle('details', { message: saved.message, values: typed });
  refresh();
  return settle('details', {});
}

export async function chooseDelivery(_state: FormState, form: FormData): Promise<FormState> {
  const basketId = await currentBasketId();
  if (!basketId) return settle('delivery', EXPIRED);
  const optionId = form.get('optionId');
  if (typeof optionId !== 'string' || optionId === '') {
    return settle('delivery', { fieldErrors: { optionId: 'Choose how we deliver' } });
  }

  const chosen = await getBasketClient().chooseDelivery(basketId, optionId);
  if (!chosen.ok) return settle('delivery', { message: chosen.message });
  refresh();
  return settle('delivery', {});
}

export async function holdDeliveryDay(_state: FormState, form: FormData): Promise<FormState> {
  const basketId = await currentBasketId();
  if (!basketId) return settle('day', EXPIRED);
  const date = form.get('date');
  if (typeof date !== 'string' || date === '') {
    return settle('day', { fieldErrors: { date: 'Choose a delivery day' } });
  }

  const held = await getBasketClient().holdDay(basketId, date);
  if (!held.ok) return settle('day', { message: held.message });
  refresh();
  return settle('day', {});
}

export async function answerAccess(_state: FormState, form: FormData): Promise<FormState> {
  const basketId = await currentBasketId();
  if (!basketId) return settle('access', EXPIRED);
  const answers = parseAccessAnswers(form);
  if (!answers.ok) return settle('access', answers.state);

  const saved = await getBasketClient().answerAccess(basketId, answers.value);
  if (!saved.ok) return settle('access', { message: saved.message });
  refresh();
  return settle('access', {});
}

export async function placeOrder(_state: FormState): Promise<FormState> {
  const placed = await completeBasket();
  if (!placed.ok) return settle('order', { message: placed.message });
  await settle('order', {});
  redirect(`/order/${placed.value}/`);
}

// A discount code on the basket page. Problems come back through the feedback cookie and the
// page is drawn again, so it works with or without JavaScript (ADR 0020).
export async function applyPromotionCode(form: FormData) {
  const code = String(form.get('code') ?? '').trim();
  const basketId = await currentBasketId();
  if (!code || !basketId) {
    await settle('promotion', { fieldErrors: { code: 'Enter a code' }, values: { code } });
  } else {
    const applied = await getBasketClient().applyCode(basketId, code);
    await settle(
      'promotion',
      applied.ok
        ? { notice: 'Code added.' }
        : { fieldErrors: { code: applied.message }, values: { code } },
    );
  }
  refresh();
}

export async function removePromotionCode() {
  const basketId = await currentBasketId();
  if (basketId) await getBasketClient().removeCode(basketId);
  await settle('promotion', {});
  refresh();
}
