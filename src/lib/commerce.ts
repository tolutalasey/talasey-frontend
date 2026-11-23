import 'server-only';
import { cacheLife } from 'next/cache';
import {
  createAccountClient,
  createAssistantClient,
  createBasketClient,
  createCatalog,
  createContentClient,
  createEnquiriesClient,
  createSamplesClient,
  type AccountClient,
  type AssistantClient,
  type BasketClient,
  type Catalog,
  type ContentClient,
  type EnquiriesClient,
  type SamplesClient,
} from '@/api-client';
import { withCurrentSitePhotos } from './current-site/photos';
import { env } from './env';

const LOCAL_API = 'http://localhost:4000';
export const apiUrl = () => env.API_URL ?? LOCAL_API;

let catalog: Catalog | undefined;
let basketClient: BasketClient | undefined;
let contentClient: ContentClient | undefined;
let samplesClient: SamplesClient | undefined;
let accountClient: AccountClient | undefined;
let assistantClient: AssistantClient | undefined;

// Products without photos in /admin show the photos from the current site's product pages.
function withPhotoFallback(source: Catalog): Catalog {
  return {
    ...source,
    getProductByHandle: async (handle) => {
      const product = await source.getProductByHandle(handle);
      return product && withCurrentSitePhotos(product);
    },
    listProducts: async () => (await source.listProducts()).map(withCurrentSitePhotos),
  };
}

export function getCatalog(): Catalog {
  catalog ??= withPhotoFallback(createCatalog({ baseUrl: apiUrl() }));
  return catalog;
}

export function getBasketClient(): BasketClient {
  basketClient ??= createBasketClient({ baseUrl: apiUrl() });
  return basketClient;
}

export function getContentClient(): ContentClient {
  contentClient ??= createContentClient({ baseUrl: apiUrl() });
  return contentClient;
}

export function getAssistantClient(): AssistantClient {
  assistantClient ??= createAssistantClient({ baseUrl: apiUrl() });
  return assistantClient;
}

export function getAccountClient(): AccountClient {
  accountClient ??= createAccountClient({ baseUrl: apiUrl() });
  return accountClient;
}

let enquiriesClient: EnquiriesClient | undefined;

export function getEnquiriesClient(): EnquiriesClient {
  enquiriesClient ??= createEnquiriesClient({ baseUrl: apiUrl() });
  return enquiriesClient;
}

export function getSamplesClient(): SamplesClient {
  samplesClient ??= createSamplesClient({ baseUrl: apiUrl() });
  return samplesClient;
}

// For lists that can be empty, like the sitemap and the search index: an API that is down (or not
// started during a build) gives an empty list instead of an error.
export async function orEmpty<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch {
    keepBriefly();
    return [];
  }
}

// An empty list from a failed load is kept for a minute instead of the caller's usual hours or
// days, so pages fill in again soon after the API is back. Outside a cached function there is
// nothing to shorten.
export function keepBriefly() {
  try {
    cacheLife('minutes');
  } catch {
    return;
  }
}
