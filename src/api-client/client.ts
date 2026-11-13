import createClient from 'openapi-fetch';
import type { paths } from './schema';

export interface ApiClientOptions {
  baseUrl: string;
  // A staff session token, for the admin and content routes.
  token?: string;
  fetch?: typeof fetch;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient({ baseUrl, token, fetch }: ApiClientOptions) {
  return createClient<paths>({
    baseUrl,
    ...(fetch && { fetch }),
    ...(token && { headers: { authorization: `Bearer ${token}` } }),
  });
}

export type ApiClient = ReturnType<typeof createApiClient>;

function messageOf(error: unknown, status: number): string {
  const message = (error as { message?: unknown } | undefined)?.message;
  if (Array.isArray(message)) return message.join('\n');
  return typeof message === 'string' ? message : `The API answered with HTTP ${status}`;
}

// Turns an openapi-fetch result into its data, or throws ApiError with the API's message.
export async function unwrap<T>(
  call: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
  const { data, error, response } = await call;
  if (error !== undefined || !response.ok)
    throw new ApiError(messageOf(error, response.status), response.status);
  return data as T;
}

// The same, but a 404 becomes null.
export async function unwrapOrNull<T>(
  call: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T | null> {
  try {
    return await unwrap(call);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
