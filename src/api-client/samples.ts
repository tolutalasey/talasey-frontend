import { createApiClient, unwrap, type ApiClientOptions } from './client';
import type { paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type SampleOffer = Json<paths['/store/samples/offers']['get']['responses'][200]>[number];
export type SampleRequestInput = NonNullable<
  paths['/store/samples']['post']['requestBody']
>['content']['application/json'];

// The free samples we offer, and taking a request for them.
export function createSamplesClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    offers: () => unwrap(api.GET('/store/samples/offers')),
    request: (body: SampleRequestInput) => unwrap(api.POST('/store/samples', { body })),
  };
}

export type SamplesClient = ReturnType<typeof createSamplesClient>;
