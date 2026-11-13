import { NextResponse } from 'next/server';
import { sessionToken, signInPath } from '@/features/staff';
import { apiUrl } from '@/lib/commerce';

// The catalogue spreadsheet, fetched from the API as the signed-in member of staff.
export async function GET(request: Request) {
  const token = await sessionToken();
  if (!token) return NextResponse.redirect(new URL(signInPath('admin'), request.url));
  const response = await fetch(new URL('/admin/catalogue/export', apiUrl()), {
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (response.status === 401)
    return NextResponse.redirect(new URL(signInPath('admin'), request.url));
  if (!response.ok) return new NextResponse('The catalogue could not be exported', { status: 502 });
  return new NextResponse(response.body, {
    headers: {
      'content-type': response.headers.get('content-type') ?? 'application/octet-stream',
      'content-disposition': response.headers.get('content-disposition') ?? 'attachment',
      'cache-control': 'private, no-store',
    },
  });
}
