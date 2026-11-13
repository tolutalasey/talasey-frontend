import { z } from 'zod';

// The event plan from PRD section 16. Names and parameters follow GA4's recommended events where
// one exists, so the same payload works for GA4 and the ad platforms' conversion APIs.

export const pageTypes = [
  'home',
  'range',
  'product',
  'guide',
  'inspiration',
  'brand',
  'local',
  'search',
  'basket',
  'checkout',
  'other',
] as const;

const path = z.string().startsWith('/');
const money = z.number().nonnegative();
const currency = z.literal('GBP');

export const item = z.object({
  item_id: z.string().min(1),
  item_name: z.string().min(1),
  item_brand: z.string().optional(),
  item_category: z.string().optional(),
  item_variant: z.string().optional(),
  price: money,
  quantity: z.number().int().positive(),
});

const items = z.array(item).min(1);
const basket = z.object({ currency, value: money, items });
const list = z.object({ item_list_id: z.string(), item_list_name: z.string() });

const event = <Name extends string, Params extends z.ZodRawShape>(name: Name, params: Params) =>
  z.object({ name: z.literal(name), params: z.object(params) });

export const pageViewEvent = event('page_view', {
  page_path: path,
  page_title: z.string().min(1),
  page_type: z.enum(pageTypes),
});

const browsing = [
  pageViewEvent,
  event('view_item_list', { ...list.shape, items }),
  event('select_item', { ...list.shape, items: z.array(item).length(1) }),
  event('view_item', basket.shape),
  event('search', { search_term: z.string().min(1), result_count: z.number().int().nonnegative() }),
  event('filter_applied', {
    filter_name: z.string().min(1),
    filter_value: z.string().min(1),
    result_count: z.number().int().nonnegative(),
  }),
  event('compare', { item_ids: z.array(z.string()).min(2).max(4) }),
] as const;

const samples = [
  event('sample_added', { items }),
  event('sample_checkout', { items }),
  event('sample_ordered', { transaction_id: z.string(), items }),
  event('sample_delivered', { transaction_id: z.string() }),
] as const;

const project = { project_type: z.string().min(1) };
const planning = [
  event('project_started', project),
  event('project_saved', { ...project, project_id: z.string() }),
  event('project_shared', {
    ...project,
    project_id: z.string(),
    method: z.enum(['link', 'email', 'whatsapp']),
  }),
  event('visualiser_used', { item_id: z.string(), mode: z.enum(['3d', 'ar', 'photo']) }),
  event('configurator_used', { item_id: z.string(), step: z.string() }),
] as const;

const buying = [
  event('add_to_cart', basket.shape),
  event('remove_from_cart', basket.shape),
  event('begin_checkout', basket.shape),
  event('add_shipping_info', { ...basket.shape, shipping_tier: z.enum(['pallet', 'parcel']) }),
  event('delivery_slot_chosen', { delivery_date: z.iso.date(), postcode_area: z.string() }),
  event('add_payment_info', { ...basket.shape, payment_type: z.string() }),
  event('purchase', {
    ...basket.shape,
    transaction_id: z.string(),
    shipping: money,
    tax: money,
  }),
  event('refund', { currency, value: money, transaction_id: z.string() }),
] as const;

const finance = [
  event('finance_quote_viewed', { value: money, currency }),
  event('finance_application_started', { value: money, currency }),
  event('finance_approved', { transaction_id: z.string(), value: money, currency }),
] as const;

const leads = [
  event('installer_quote_requested', { postcode_area: z.string(), project_type: z.string() }),
  event('generate_lead', { form_name: z.string().min(1) }),
  event('chat_started', { page_path: path }),
  event('whatsapp_clicked', { page_path: path }),
  event('phone_clicked', { page_path: path }),
  event('showroom_booked', { showroom: z.string() }),
] as const;

const content = [
  event('guide_read', { page_path: path, percent_scrolled: z.literal(75) }),
  event('video_progress', {
    video_title: z.string(),
    video_percent: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
  }),
  event('file_download', { file_name: z.string(), file_extension: z.string() }),
] as const;

export const analyticsEvent = z.discriminatedUnion('name', [
  ...browsing,
  ...samples,
  ...planning,
  ...buying,
  ...finance,
  ...leads,
  ...content,
]);

export type AnalyticsEvent = z.infer<typeof analyticsEvent>;
export type EventName = AnalyticsEvent['name'];
export type EventParams<Name extends EventName> = Extract<AnalyticsEvent, { name: Name }>['params'];

export const eventNames = analyticsEvent.options.map(
  (option) => option.shape.name.value,
) as EventName[];

// Sent by our servers when the thing happens, never from the browser.
export const serverOnlyEvents: ReadonlySet<EventName> = new Set([
  'sample_delivered',
  'finance_approved',
  'refund',
]);

// The conversions the business is measured on.
export const keyEvents: ReadonlySet<EventName> = new Set([
  'purchase',
  'sample_ordered',
  'installer_quote_requested',
  'finance_approved',
  'generate_lead',
]);
