import 'server-only';
import type {
  AvailableDay,
  Basket,
  CheckoutResult,
  DeliveryOption,
  PlacedOrder,
} from '@/api-client';
import { getBasketClient } from '@/lib/commerce';
import { env } from '@/lib/env';
import { paymentMode } from '@/lib/payment';
import { readBasketId } from './basket-cookie.server';
import type { FormFeedback } from '@/lib/form-feedback';
import { readFeedback } from '@/lib/form-feedback.server';
import { loadPaymentView, type PaymentView } from './payment-view';

export interface BasketView {
  basket: Basket;
  stock: Record<string, string>;
}

export interface CheckoutView {
  basket: Basket;
  options: DeliveryOption[] | null;
  days: CheckoutResult<AvailableDay[]> | null;
  payment: PaymentView | null;
  feedback: FormFeedback;
}

export async function getBasket(): Promise<Basket | null> {
  const id = await readBasketId();
  return id ? getBasketClient().find(id) : null;
}

export async function getBasketView(): Promise<BasketView | null> {
  const basket = await getBasket();
  if (!basket || basket.lines.length === 0) return null;

  const stock = await getBasketClient().stock(basket.id);
  return {
    basket,
    stock: Object.fromEntries(stock.map((line) => [line.lineId, line.label])),
  };
}

// Each step only loads once the one before it is done: delivery prices need the postcode, and
// pallet days need a pallet delivery to be chosen.
export async function getCheckoutView(): Promise<CheckoutView | null> {
  const basket = await getBasket();
  if (!basket || basket.lines.length === 0) return null;

  const client = getBasketClient();
  const { shipment, day, access } = basket.delivery;
  const options = basket.address ? await client.deliveryOptions(basket.id) : null;
  const days = shipment === 'pallet' ? await client.deliveryDays(basket.id) : null;
  const readyToPay = shipment === 'parcel' || (shipment === 'pallet' && !!day && !!access);
  const payment = readyToPay
    ? await loadPaymentView(
        paymentMode(env),
        basket.id,
        client,
        new URL('/checkout/paid/', env.SITE_URL).href,
      )
    : null;

  return { basket, options, days, payment, feedback: await readFeedback() };
}

export async function getOrder(id: string): Promise<PlacedOrder | null> {
  return getBasketClient().order(id);
}
