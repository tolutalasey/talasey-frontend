import { ApiError } from '@/api-client';
import { getAssistantClient } from '@/lib/commerce';

const MAX_BODY_BYTES = 200_000;

const visitorIp = (request: Request) =>
  request.headers.get('x-real-ip') ??
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  null;

const fromThisSite = (request: Request) => {
  const origin = request.headers.get('origin');
  return !origin || new URL(origin).host === new URL(request.url).host;
};

// Whether the chat button shows: only when the backend has the assistant switched on.
export async function GET() {
  const enabled = await getAssistantClient()
    .enabled()
    .catch(() => false);
  return Response.json(
    { enabled },
    { headers: { 'cache-control': 'public, max-age=0, s-maxage=300' } },
  );
}

// The chat panel's messages, passed to the backend with the visitor's address for its limits.
export async function POST(request: Request) {
  if (!fromThisSite(request)) return Response.json({ error: 'Not allowed' }, { status: 403 });
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return Response.json({ error: 'That message is too long' }, { status: 413 });
  }
  try {
    const reply = await getAssistantClient().reply(JSON.parse(text), visitorIp(request));
    return Response.json({ reply }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return Response.json({ error: 'No reply' }, { status: status === 429 ? 429 : 503 });
  }
}
