import { createApiClient, unwrap, type ApiClientOptions } from './client';

// What the content team has published, by type: 'guide', 'faq', 'home', 'redirect' and so on.
export function createContentClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    published: (type: string) =>
      unwrap(api.GET('/store/content/{type}', { params: { path: { type } } })),
  };
}

export type ContentClient = ReturnType<typeof createContentClient>;
