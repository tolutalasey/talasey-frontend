import { ApiError } from '@/api-client';
import { getAssistantClient } from '@/lib/commerce';
import { fromThisSite, visitorIp } from '@/lib/visitor-request';

const MAX_BYTES = 5 * 1024 * 1024;

// A garden photo from the chat, passed to the backend before the message that goes with it.
export async function POST(request: Request) {
  if (!fromThisSite(request)) return Response.json({ error: 'Not allowed' }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const photo = form?.get('photo');
  if (!(photo instanceof Blob) || photo.size === 0 || photo.size > MAX_BYTES) {
    return Response.json({ error: 'Send a photo under 5 MB' }, { status: 422 });
  }
  const upload = new FormData();
  upload.set('photo', photo, 'photo.jpg');
  try {
    const photoId = await getAssistantClient().addPhoto(upload, visitorIp(request));
    return Response.json({ photoId }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 503;
    return Response.json(
      { error: error instanceof Error ? error.message : 'No upload' },
      { status },
    );
  }
}
