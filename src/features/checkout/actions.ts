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
    const extraAdded = await client.addItem(basketId, extra.variantId, extra.quantity);
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

const wholeNumber = (value: FormDataEntryValue | null) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
};

// The basket's −, + and Remove buttons. A removed line can be put back with Undo, unless it was
// made to measure, part of a build or a chosen colour, which the basket can't add back as it was.
export async function changeLine(form: FormData) {
  const basketId = await currentBasketId();
  const lineId = String(form.get('lineId') ?? '');
  const quantity = wholeNumber(form.get('quantity'));
  if (!basketId) {
    await settle('lines', EXPIRED);
  } else if (quantity === null || quantity > 999) {
    await settle('lines', { message: 'Enter a number of packs from 0 to 999.' });
  } else {
    const changed = await getBasketClient().setQuantity(basketId, lineId, quantity);
    const title = String(form.get('title') ?? 'the item');
    const undo = String(form.get('undo') ?? '');
    await settle(
      'lines',
      !changed.ok
        ? { message: changed.message }
        : quantity === 0
          ? {
              notice: `Removed ${title}.`,
              values: undo
                ? { variantId: undo, quantity: String(form.get('was') ?? '1'), title }
                : {},
            }
          : {},
    );
  }
  refresh();
}

export async function undoRemove(form: FormData) {
  const basketId = await currentBasketId();
  const variantId = String(form.get('variantId') ?? '');
  const quantity = wholeNumber(form.get('quantity')) ?? 1;
  if (basketId && variantId) {
    const added = await getBasketClient().addItem(basketId, variantId, Math.max(quantity, 1));
    await settle(
      'lines',
      added.ok ? { notice: `Put back ${String(form.get('title'))}.` } : { message: added.message },
    );
  }
  refresh();
}

// "Buy again" from the account page: each line arrives as variantId:quantity. Lines that can no
// longer be bought are skipped. How many were added goes in the address, because the bag page
// rendered after this redirect cannot see a cookie set here.
export async function buyAgain(form: FormData) {
  const items = form.getAll('item').flatMap((value) => {
    const [variantId, count] = String(value).split(':');
    const quantity = Number(count);
    return variantId && Number.isInteger(quantity) && quantity > 0 ? [{ variantId, quantity }] : [];
  });
  const client = getBasketClient();
  let basketId = await currentBasketId();
  if (!basketId) {
    basketId = (await client.create()).id;
    await rememberBasket(basketId);
  }
  let added = 0;
  for (const item of items) {
    if ((await client.addItem(basketId, item.variantId, item.quantity)).ok) added += 1;
  }
  redirect(`/basket/?again=${added}-${items.length}`);
}
