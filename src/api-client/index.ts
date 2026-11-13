import 'server-only';

export {
  ApiError,
  createApiClient,
  unwrap,
  unwrapOrNull,
  type ApiClient,
  type ApiClientOptions,
} from './client';
export {
  createBasketClient,
  type AccessAnswers,
  type AvailableDay,
  type Basket,
  type BasketClient,
  type BasketLine,
  type CheckoutResult,
  type DeliveryAddress,
  type DeliveryDay,
  type DeliveryOption,
  type LineColour,
  type LineStock,
  type PaymentKind,
  type PlacedOrder,
  type Shipment,
  type VehicleAccess,
} from './basket';
export { createCatalog, type Catalog } from './catalog';
export { createContentClient, type ContentClient } from './content';
export {
  isAvailable,
  isInStock,
  lowestPrice,
  type Colour,
  type ColourChoice,
  type ColourOffer,
  type Price,
  type Product,
  type ProductCategory,
  type ProductImage,
  type ProductOption,
  type ProductVariant,
  type VariantStock,
} from './product';
export {
  createStaffClient,
  type AuditEntry,
  type StaffAccount,
  type StaffClient,
  type StaffMember,
  type SignInResult,
  type StaffSession,
} from './staff';
export type { components, paths } from './schema';
