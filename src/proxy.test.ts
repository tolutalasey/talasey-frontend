import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { StaticRedirectSource } from '@/lib/redirects';
import { createProxy } from './proxy';

const handle = createProxy(
  new StaticRedirectSource([
    { from: '/porcelain-tiles.html', to: '/porcelain-paving/', permanent: true },
    { from: '/winter-sale', to: '/offers/', permanent: false },
  ]),
  { 'X-Content-Type-Options': 'nosniff' },
);

const get = (path: string) => handle(new NextRequest(`http://localhost:3000${path}`));

describe('proxy', () => {
  it('sends old addresses to their new page with a permanent redirect, keeping the query', async () => {
    const response = await get('/porcelain-tiles.html?utm_source=pinterest');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/porcelain-paving/?utm_source=pinterest',
    );
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('uses a temporary redirect when the move is not permanent', async () => {
    expect((await get('/winter-sale')).status).toBe(302);
  });

  it('lets every other request through with the security headers', async () => {
    const response = await get('/porcelain-paving/');
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});
