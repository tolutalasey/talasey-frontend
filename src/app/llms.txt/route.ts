import { connection } from 'next/server';
import { llmsText } from '@/features/site-index';

export async function GET() {
  await connection();
  return new Response(await llmsText(), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
