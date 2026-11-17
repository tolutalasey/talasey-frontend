import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { llmsText } from '@/features/site-index';
import { env } from '@/lib/env';

// Only the live site publishes it; staging stays out of every crawler's and filter's view.
export async function GET() {
  await connection();
  if (env.APP_ENV !== 'production') notFound();
  return new Response(await llmsText(), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
