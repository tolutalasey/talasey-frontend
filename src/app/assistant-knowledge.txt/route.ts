import { connection } from 'next/server';
import { assistantKnowledge } from '@/features/assistant';

// The site's own words for the assistant on the backend to answer from. All of it is public.
export async function GET() {
  await connection();
  return new Response(await assistantKnowledge(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=600',
      'x-robots-tag': 'noindex',
    },
  });
}
