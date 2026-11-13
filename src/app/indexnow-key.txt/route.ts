import { env } from '@/lib/env';

// IndexNow checks this file to confirm the key belongs to the site.
export function GET() {
  if (env.APP_ENV !== 'production' || !env.INDEXNOW_KEY) return new Response(null, { status: 404 });
  return new Response(env.INDEXNOW_KEY, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
