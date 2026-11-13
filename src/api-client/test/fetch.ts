import { vi } from 'vitest';

export function mockFetch(status: number, body: unknown) {
  return vi.fn<typeof fetch>(async () =>
    Response.json(body, { status, headers: { 'content-type': 'application/json' } }),
  );
}

export function requestedUrl(fetchMock: ReturnType<typeof mockFetch>, call = 0): URL {
  const input = fetchMock.mock.calls[call]?.[0];
  if (input instanceof Request) return new URL(input.url);
  return new URL(String(input));
}
