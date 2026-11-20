import { NextResponse } from 'next/server';
import { staffApi } from '@/features/staff';

interface Context {
  params: Promise<{ id: string; number: string }>;
}

// Garden photos are private, so staff fetch them through their own session.
export async function GET(_request: Request, { params }: Context) {
  const { id, number } = await params;
  const { data, response } = await (
    await staffApi()
  ).GET('/admin/enquiries/{id}/photos/{number}', {
    params: { path: { id, number: Number(number) } },
    parseAs: 'arrayBuffer',
  });
  if (!data) return new NextResponse(null, { status: response.status === 401 ? 401 : 404 });
  return new NextResponse(data, {
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
