import { createApiClient, unwrap, type ApiClientOptions } from './client';
import type { paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type AssistantRequest = Json<paths['/store/assistant/messages']['post']['requestBody']>;

export function createAssistantClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    enabled: async () => (await unwrap(api.GET('/store/assistant'))).enabled,
    reply: async (request: AssistantRequest, visitorIp: string | null) =>
      (
        await unwrap(
          api.POST('/store/assistant/messages', {
            body: request,
            ...(visitorIp && { headers: { 'x-visitor-ip': visitorIp } }),
          }),
        )
      ).reply,
  };
}

export type AssistantClient = ReturnType<typeof createAssistantClient>;
