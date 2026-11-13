import { describe, expect, it, vi } from 'vitest';
import { IndexNowApi, indexNowFromEnv } from './indexnow';

describe('IndexNowApi', () => {
  it('sends the changed URLs on our host with the key and where to find it', async () => {
    const send = vi.fn<typeof fetch>(async () => new Response(null, { status: 202 }));
    await new IndexNowApi({
      key: 'abc12345key',
      siteUrl: 'https://www.talasey.co.uk',
      fetch: send,
    }).notify([
      'https://www.talasey.co.uk/products/sienna-planter/',
      'https://www.talasey.co.uk/products/sienna-planter/',
      'https://elsewhere.example/page/',
    ]);

    const [url, init] = send.mock.calls[0] ?? [];
    expect(url).toBe('https://api.indexnow.org/indexnow');
    expect(JSON.parse(String(init?.body))).toEqual({
      host: 'www.talasey.co.uk',
      key: 'abc12345key',
      keyLocation: 'https://www.talasey.co.uk/indexnow-key.txt',
      urlList: ['https://www.talasey.co.uk/products/sienna-planter/'],
    });
  });

  it('sends nothing when no URL changed', async () => {
    const send = vi.fn<typeof fetch>();
    await new IndexNowApi({ key: 'abc12345key', siteUrl: 'https://x.test', fetch: send }).notify(
      [],
    );
    expect(send).not.toHaveBeenCalled();
  });
});

describe('indexNowFromEnv', () => {
  it('does nothing outside production or without a key', () => {
    expect(
      indexNowFromEnv({
        APP_ENV: 'development',
        INDEXNOW_KEY: 'abc12345key',
        SITE_URL: 'http://localhost:3000',
      }).name,
    ).toBe('off');
    expect(indexNowFromEnv({ APP_ENV: 'production', SITE_URL: 'https://x.test' }).name).toBe('off');
    expect(
      indexNowFromEnv({
        APP_ENV: 'production',
        INDEXNOW_KEY: 'abc12345key',
        SITE_URL: 'https://x.test',
      }).name,
    ).toBe('IndexNow');
  });
});
