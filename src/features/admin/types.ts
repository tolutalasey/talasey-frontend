import type { paths } from '@/api-client';
import type { BadgeTone } from '@/features/staff';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type AdminProduct = Json<paths['/admin/products/{id}']['get']['responses'][200]>;
export type ProductInput = NonNullable<
  paths['/admin/products/{id}']['put']['requestBody']
>['content']['application/json'];
export type ProductSummary = Json<paths['/admin/products']['get']['responses'][200]>[number];
export type ColourSet = Json<paths['/admin/colour-sets/{id}']['get']['responses'][200]>;
export type Category = Json<paths['/admin/categories']['get']['responses'][200]>[number];
export type Order = Json<paths['/admin/orders/{id}']['get']['responses'][200]>;
export type OrderSummary = Json<paths['/admin/orders']['get']['responses'][200]>[number];
export type Zone = Json<paths['/admin/delivery/zones']['get']['responses'][200]>[number];
export type ZoneDay = Json<
  paths['/admin/delivery/zones/{zone}/days']['get']['responses'][200]
>[number];
export type SkuProblem = Json<
  paths['/admin/catalogue/sku-checks']['get']['responses'][200]
>[number];
export type AuditEntry = Json<paths['/admin/audit']['get']['responses'][200]>[number];
export type StaffAccount = Json<paths['/admin/users']['get']['responses'][200]>[number];

export const PAGE_TYPES = [
  { value: '1A', label: '1A: every colour and size is its own option' },
  { value: '1B', label: '1B: options for size and finish, colour from a colour set' },
  { value: '2', label: '2: made to measure' },
  { value: '3', label: '3: enquiry only' },
  { value: '4', label: '4: build your own' },
];

export const OFFLINE_ACTIONS = [
  { value: 'stockist', label: 'Find a stockist' },
  { value: 'installer', label: 'Find an installer (enquiry)' },
  { value: 'showroom', label: 'Book a showroom visit' },
];

export const STOCK_MODES = [
  { value: 'stocked', label: 'Stocked only: stops selling when stock runs out' },
  { value: 'stocked_then_made_to_order', label: 'Stocked, then made to order' },
  { value: 'made_to_order', label: 'Made to order: always available' },
];
export type SampleOfferAdmin = Json<
  paths['/admin/samples/offers']['get']['responses'][200]
>[number];
export type SampleRequest = Json<paths['/admin/samples/requests']['get']['responses'][200]>[number];
export type Promotion = Json<paths['/admin/promotions']['get']['responses'][200]>[number];
export type Enquiry = Json<paths['/admin/enquiries']['get']['responses'][200]>[number];
export type EnquiryStatus = Enquiry['status'];

export const ENQUIRY_STATUS: Record<EnquiryStatus, { label: string; tone: BadgeTone }> = {
  new: { label: 'New', tone: 'warn' },
  'in-progress': { label: 'In progress', tone: 'info' },
  done: { label: 'Done', tone: 'good' },
};

export const ENQUIRY_TITLE: Record<Enquiry['kind'], string> = {
  contact: 'Enquiry',
  'site-survey': 'Site survey request',
  stockist: 'Stockist request',
  installer: 'Installer request',
  showroom: 'Showroom visit request',
  partner: 'Partner Programme application',
  warranty: 'Warranty registration',
};

export type AssistantStatus = Json<paths['/admin/assistant']['get']['responses'][200]>;
export type AssistantUsage = Json<paths['/admin/assistant/usage']['get']['responses'][200]>;
export type AssistantConversationSummary = Json<
  paths['/admin/assistant/conversations']['get']['responses'][200]
>[number];
export type AssistantExchange = Json<
  paths['/admin/assistant/conversations/{id}']['get']['responses'][200]
>[number];
export type AssistantGap = Json<paths['/admin/assistant/gaps']['get']['responses'][200]>[number];
