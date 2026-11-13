import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { changedUrls, indexNowFromEnv } from '@/lib/indexnow';
import { isValidSignature, SIGNATURE_HEADER, TIMESTAMP_HEADER } from '@/lib/webhook-signature';

const revalidateRequest = z.object({
  tags: z
    .array(z.string().regex(/^[a-z]+(:[\w-]+)?$/i))
    .min(1)
    .max(50),
});

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  if (!env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Revalidation is not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signed = isValidSignature({
    body,
    timestamp: request.headers.get(TIMESTAMP_HEADER),
    signature: request.headers.get(SIGNATURE_HEADER)?.replace(/^sha256=/, '') ?? null,
    secret: env.REVALIDATE_SECRET,
  });
  if (!signed) return Response.json({ error: 'Invalid signature' }, { status: 401 });

  const parsed = revalidateRequest.safeParse(parseJson(body));
  if (!parsed.success)
    return Response.json({ error: 'Expected { tags: string[] }' }, { status: 400 });

  for (const tag of parsed.data.tags) revalidateTag(tag, 'max');
  // Published changes are announced to IndexNow after the response, so a slow or failed ping
  // never holds up revalidation.
  const urls = changedUrls(parsed.data.tags);
  after(() => indexNowFromEnv(env).notify(urls));
  return Response.json({ revalidated: parsed.data.tags });
}
