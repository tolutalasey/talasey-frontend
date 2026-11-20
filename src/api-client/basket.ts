import { ApiError, createApiClient, unwrap, unwrapOrNull, type ApiClientOptions } from './client';
import type { Price } from './product';
import type { paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;
type BasketDto = Json<paths['/store/baskets/{id}']['get']['responses'][200]>;
type OrderDto = Json<paths['/store/orders/{id}']['get']['responses'][200]>;

export interface BuildPart {
  variantId: string;
  quantity: number;
  side?: string;
}

export type Shipment = 'pallet' | 'parcel';
export type VehicleAccess = 'articulated' | 'rigid' | 'small';
export type PaymentKind = 'stripe' | 'test';

export interface AccessAnswers {
  vehicleAccess: VehicleAccess;
  hardStanding: boolean;
  kerbsideOk: boolean;
}

// A colour from the product's colour set, chosen beside the SKU (page type 1B).
export interface LineColour {
  id: string;
  name: string;
}

export interface BasketLine {
  id: string;
  handle: string | null;
  variantId: string | null;
  title: string;
  variantTitle: string | null;
  colour: string | null;
  quantity: number;
  unitPrice: Price;
  total: Price;
  buildId: string | null;
  // How a made-to-measure line reads, like "1200 × 400 × 500 mm, Powder coated".
  bespoke: string | null;
  stock: string;
}

export interface DeliveryDay {
  date: string;
  status: 'held' | 'booked' | 'needs-rebooking';
}

export interface BasketDelivery {
  shipment: Shipment | null;
  name: string | null;
  day: DeliveryDay | null;
  access: AccessAnswers | null;
}

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postcode: string;
  phone: string;
}

export interface BasketSample {
  offerId: string;
  productTitle: string;
  productHandle: string;
  label: string;
  price: Price;
}

export interface Basket {
  id: string;
  email: string | null;
  address: DeliveryAddress | null;
  lines: BasketLine[];
  samples: BasketSample[];
  itemTotal: Price;
  deliveryTotal: Price | null;
  discount: Price | null;
  promotions: string[];
  promotionCode: string | null;
  total: Price;
  delivery: BasketDelivery;
  payment: PaymentKind;
  orderId: string | null;
}

export interface DeliveryOption {
  id: Shipment;
  shipment: Shipment;
  name: string;
  price: Price | null;
  problem: string | null;
}

export interface AvailableDay {
  date: string;
  remaining: number;
}

export interface LineStock {
  lineId: string;
  label: string;
}

export interface PlacedOrder {
  id: string;
  displayId: number | null;
  email: string | null;
  lines: BasketLine[];
  samples: BasketSample[];
  itemTotal: Price;
  deliveryTotal: Price;
  discount: Price | null;
  promotions: string[];
  total: Price;
  delivery: BasketDelivery;
  payment: PaymentKind;
}

export type CheckoutResult<T = void> = { ok: true; value: T } | { ok: false; message: string };

const pounds = (pence: number): Price => ({ amount: pence / 100, currencyCode: 'GBP' });

function toLine(line: BasketDto['lines'][number] | OrderDto['lines'][number]): BasketLine {
  return {
    id: line.id,
    handle: 'handle' in line ? line.handle : null,
    variantId: line.variantId ?? null,
    title: line.title,
    variantTitle: line.variantTitle || null,
    colour: line.colour,
    quantity: line.quantity,
    unitPrice: pounds(line.unitPricePence ?? 0),
    total: pounds(line.totalPence),
    buildId: line.buildId,
    bespoke: line.bespoke ? (line.bespoke.summary ?? 'Made to measure') : null,
    stock: line.stock,
  };
}

const toSample = ({ pricePence, ...sample }: BasketDto['samples'][number]): BasketSample => ({
  ...sample,
  price: pounds(pricePence),
});

export function toBasket(basket: BasketDto): Basket {
  return {
    id: basket.id,
    email: basket.email,
    address: basket.address,
    lines: basket.lines.map(toLine),
    samples: basket.samples.map(toSample),
    itemTotal: pounds(basket.itemTotalPence),
    deliveryTotal: basket.deliveryPence === null ? null : pounds(basket.deliveryPence),
    discount: basket.discountPence > 0 ? pounds(basket.discountPence) : null,
    promotions: basket.promotions.map((promotion) => promotion.name),
    promotionCode: basket.promotionCode,
    total: pounds(basket.totalPence),
    delivery: basket.delivery,
    payment: basket.payment,
    orderId: basket.orderId,
  };
}

export function toPlacedOrder(order: OrderDto): PlacedOrder {
  return {
    id: order.id,
    displayId: order.number,
    email: order.email,
    lines: order.lines.map(toLine),
    samples: order.samples.map(toSample),
    itemTotal: pounds(order.itemTotalPence),
    deliveryTotal: pounds(order.deliveryPence),
    discount: order.discountPence > 0 ? pounds(order.discountPence) : null,
    promotions: order.promotions,
    total: pounds(order.totalPence),
    delivery: order.delivery,
    payment: order.payment.provider,
  };
}

async function attempt<T>(call: () => Promise<T>): Promise<CheckoutResult<T>> {
  try {
    return { ok: true, value: await call() };
  } catch (error) {
    if (error instanceof ApiError && error.status < 500)
      return { ok: false, message: error.message };
    throw error;
  }
}

export function createBasketClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  const path = (id: string) => ({ params: { path: { id } } });

  return {
    async find(id: string): Promise<Basket | null> {
      const basket = await unwrapOrNull(api.GET('/store/baskets/{id}', path(id)));
      return basket ? toBasket(basket) : null;
    },

    async create(): Promise<Basket> {
      return toBasket(await unwrap(api.POST('/store/baskets')));
    },

    addItem: (basketId: string, variantId: string, quantity: number, colour?: LineColour) =>
      attempt(async () => {
        await unwrap(
          api.POST('/store/baskets/{id}/lines', {
            ...path(basketId),
            body: { variantId, quantity, ...(colour && { colourId: colour.id }) },
          }),
        );
      }),

    // A build from a builder page: every part goes in together, kept as one build.
    addBuild: (basketId: string, parts: BuildPart[]) =>
      attempt(async () => {
        await unwrap(
          api.POST('/store/baskets/{id}/builds', { ...path(basketId), body: { parts } }),
        );
      }),

    addMadeToMeasure: (
      basketId: string,
      variantId: string,
      dimensions: Record<string, number>,
      choices: Record<string, string>,
    ) =>
      attempt(async () => {
        await unwrap(
          api.POST('/store/baskets/{id}/bespoke-items', {
            ...path(basketId),
            body: { variantId, quantity: 1, dimensions, choices },
          }),
        );
      }),

    addSample: (basketId: string, offerId: string) =>
      attempt(async () => {
        await unwrap(
          api.POST('/store/baskets/{id}/samples', { ...path(basketId), body: { offerId } }),
        );
      }),

    removeSample: (basketId: string, offerId: string) =>
      attempt(async () => {
        await unwrap(
          api.DELETE('/store/baskets/{id}/samples/{offerId}', {
            params: { path: { id: basketId, offerId } },
          }),
        );
      }),

    applyCode: (basketId: string, code: string) =>
      attempt(async () => {
        await unwrap(
          api.PUT('/store/baskets/{id}/promotion', { ...path(basketId), body: { code } }),
        );
      }),

    removeCode: (basketId: string) =>
      attempt(async () => {
        await unwrap(api.DELETE('/store/baskets/{id}/promotion', path(basketId)));
      }),

    setQuantity: (basketId: string, lineId: string, quantity: number) =>
      attempt(async () => {
        await unwrap(
          api.PATCH('/store/baskets/{id}/lines/{lineId}', {
            params: { path: { id: basketId, lineId } },
            body: { quantity },
          }),
        );
      }),

    setContact: (basketId: string, email: string, address: DeliveryAddress) =>
      attempt(async () => {
        await unwrap(
          api.PUT('/store/baskets/{id}/contact', { ...path(basketId), body: { email, address } }),
        );
      }),

    async deliveryOptions(basketId: string): Promise<DeliveryOption[]> {
      const options = await unwrap(api.GET('/store/baskets/{id}/delivery-options', path(basketId)));
      return options.map((option) => ({
        id: option.shipment,
        shipment: option.shipment,
        name: option.name,
        price: option.pricePence === null ? null : pounds(option.pricePence),
        problem: option.problem,
      }));
    },

    chooseDelivery: (basketId: string, optionId: string) =>
      attempt(async () => {
        const shipment = optionId === 'parcel' ? 'parcel' : 'pallet';
        await unwrap(
          api.PUT('/store/baskets/{id}/delivery', { ...path(basketId), body: { shipment } }),
        );
      }),

    deliveryDays: (basketId: string) =>
      attempt(() => unwrap(api.GET('/store/baskets/{id}/delivery-days', path(basketId)))),

    holdDay: (basketId: string, date: string) =>
      attempt(async () => {
        await unwrap(
          api.PUT('/store/baskets/{id}/delivery-day', { ...path(basketId), body: { date } }),
        );
      }),

    answerAccess: (basketId: string, answers: AccessAnswers) =>
      attempt(async () => {
        await unwrap(api.PUT('/store/baskets/{id}/access', { ...path(basketId), body: answers }));
      }),

    async stock(basketId: string): Promise<LineStock[]> {
      const basket = await unwrap(api.GET('/store/baskets/{id}', path(basketId)));
      return basket.lines.map((line) => ({ lineId: line.id, label: line.stock }));
    },

    startCardPayment: (basketId: string) =>
      attempt(async () => {
        const started = await unwrap(api.POST('/store/baskets/{id}/payment', path(basketId)));
        if (!started.clientSecret)
          throw new ApiError('Card payments are not available right now.', 422);
        return { clientSecret: started.clientSecret };
      }),

    placeOrder: (basketId: string, paymentReference?: string) =>
      attempt(async () => {
        const placed = await unwrap(
          api.POST('/store/baskets/{id}/complete', {
            ...path(basketId),
            body: paymentReference ? { paymentReference } : {},
          }),
        );
        return placed.orderId;
      }),

    async order(id: string): Promise<PlacedOrder | null> {
      const order = await unwrapOrNull(api.GET('/store/orders/{id}', path(id)));
      return order ? toPlacedOrder(order) : null;
    },
  };
}

export type BasketClient = ReturnType<typeof createBasketClient>;
