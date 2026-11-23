import { createApiClient, unwrap, type ApiClientOptions } from './client';
import type { paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type AssistantRequest = Json<paths['/store/assistant/messages']['post']['requestBody']>;
export type AssistantReply = Json<paths['/store/assistant/messages']['post']['responses'][200]>;
export type AssistantProductCard = AssistantReply['products'][number];

export function createAssistantClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    enabled: async () => (await unwrap(api.GET('/store/assistant'))).enabled,
    reply: (request: AssistantRequest, visitorIp: string | null) =>
      unwrap(
        api.POST('/store/assistant/messages', {
          body: request,
          ...(visitorIp && { headers: { 'x-visitor-ip': visitorIp } }),
        }),
      ),
  };
}

export type AssistantClient = ReturnType<typeof createAssistantClient>;
