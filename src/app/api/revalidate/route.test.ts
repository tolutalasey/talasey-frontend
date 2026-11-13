import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signPayload } from '@/lib/webhook-signature';

const secret = 'a-test-secret-that-is-long-enough-123';
const revalidateTag = vi.fn();
const notify = vi.fn(async () => undefined);

vi.mock('next/cache', () => ({ revalidateTag }));
vi.mock('next/server', () => ({ after: (task: () => unknown) => task() }));
vi.mock('@/lib/env', () => ({
  env: { REVALIDATE_SECRET: secret, SITE_URL: 'http://localhost:3000', APP_ENV: 'development' },
}));
vi.mock('@/lib/indexnow', async (load) => ({
  ...(await load<object>()),
  indexNowFromEnv: () => ({ name: 'test', notify }),
}));

const { POST } = await import('./route');

function signedRequest(body: string, signature?: string) {
  const timestamp = String(Date.now());
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    body,
    headers: {
      'x-talasey-timestamp': timestamp,
      'x-talasey-signature': `sha256=${signature ?? signPayload(body, timestamp, secret)}`,
    },
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    revalidateTag.mockClear();
    notify.mockClear();
  });

  it('revalidates each tag in a signed request', async () => {
    const response = await POST(signedRequest('{"tags":["products","product:pavetuf"]}'));

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('products', 'max');
    expect(revalidateTag).toHaveBeenCalledWith('product:pavetuf', 'max');
  });

  it('announces the changed product pages to IndexNow', async () => {
    await POST(signedRequest('{"tags":["products","product:pavetuf"]}'));
    expect(notify).toHaveBeenCalledWith(['http://localhost:3000/products/pavetuf/']);
  });

  it('rejects an unsigned request', async () => {
    const response = await POST(signedRequest('{"tags":["products"]}', 'deadbeef'));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects a signed request with a bad body', async () => {
    expect((await POST(signedRequest('not json'))).status).toBe(400);
    expect((await POST(signedRequest('{"tags":["bad tag!"]}'))).status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
