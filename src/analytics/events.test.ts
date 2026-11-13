import { describe, expect, it } from 'vitest';
import { analyticsEvent, eventNames, keyEvents, serverOnlyEvents } from './events';

// Every event in PRD section 16, by area.
const prdEventPlan = {
  browsing: [
    'page_view',
    'view_item_list',
    'select_item',
    'view_item',
    'search',
    'filter_applied',
    'compare',
  ],
  samples: ['sample_added', 'sample_checkout', 'sample_ordered', 'sample_delivered'],
  planning: [
    'project_started',
    'project_saved',
    'project_shared',
    'visualiser_used',
    'configurator_used',
  ],
  buying: [
    'add_to_cart',
    'remove_from_cart',
    'begin_checkout',
    'add_shipping_info',
    'delivery_slot_chosen',
    'add_payment_info',
    'purchase',
    'refund',
  ],
  finance: ['finance_quote_viewed', 'finance_application_started', 'finance_approved'],
  leads: [
    'installer_quote_requested',
    'generate_lead',
    'chat_started',
    'whatsapp_clicked',
    'phone_clicked',
    'showroom_booked',
  ],
  content: ['guide_read', 'video_progress', 'file_download'],
};

const paving = {
  item_id: 'POR-DSK-600',
  item_name: 'Dusk grey porcelain paving',
  item_brand: 'Vitripiazza',
  price: 89.99,
  quantity: 2,
};

describe('the event schema', () => {
  it('has exactly the PRD section 16 events', () => {
    expect([...eventNames].sort()).toEqual(Object.values(prdEventPlan).flat().sort());
  });

  it('marks the PRD key events and the server-side ones', () => {
    expect([...keyEvents].sort()).toEqual([
      'finance_approved',
      'generate_lead',
      'installer_quote_requested',
      'purchase',
      'sample_ordered',
    ]);
    expect([...serverOnlyEvents].sort()).toEqual([
      'finance_approved',
      'refund',
      'sample_delivered',
    ]);
  });

  it.each([
    { name: 'page_view', params: { page_path: '/', page_title: 'Home', page_type: 'home' } },
    { name: 'add_to_cart', params: { currency: 'GBP', value: 179.98, items: [paving] } },
    {
      name: 'purchase',
      params: {
        currency: 'GBP',
        value: 224.98,
        transaction_id: 'order_1',
        shipping: 45,
        tax: 37.5,
        items: [paving],
      },
    },
    { name: 'search', params: { search_term: 'grey porcelain', result_count: 31 } },
    { name: 'delivery_slot_chosen', params: { delivery_date: '2026-11-17', postcode_area: 'M' } },
    { name: 'generate_lead', params: { form_name: 'Garden room survey' } },
    {
      name: 'guide_read',
      params: { page_path: '/guides/how-to-lay-porcelain/', percent_scrolled: 75 },
    },
  ])('accepts a valid $name', (event) => {
    expect(analyticsEvent.safeParse(event).success).toBe(true);
  });

  it.each([
    ['an unknown event', { name: 'add_to_wishlist', params: {} }],
    [
      'a page type we do not have',
      { name: 'page_view', params: { page_path: '/', page_title: 'x', page_type: 'cart' } },
    ],
    [
      'a price in another currency',
      { name: 'add_to_cart', params: { currency: 'EUR', value: 1, items: [paving] } },
    ],
    [
      'a basket event with no items',
      { name: 'begin_checkout', params: { currency: 'GBP', value: 0, items: [] } },
    ],
    ['a search without a result count', { name: 'search', params: { search_term: 'decking' } }],
    [
      'a guide read below 75%',
      { name: 'guide_read', params: { page_path: '/guides/x/', percent_scrolled: 50 } },
    ],
    [
      'a delivery day that is not a date',
      { name: 'delivery_slot_chosen', params: { delivery_date: 'Tuesday', postcode_area: 'M' } },
    ],
  ])('rejects %s', (_, event) => {
    expect(analyticsEvent.safeParse(event).success).toBe(false);
  });
});
