import { NextResponse, type NextRequest } from 'next/server';
import { contentFor } from '@/features/live-preview';
import { staffApi } from '@/features/staff';

const nothing = () => new NextResponse(null, { status: 204 });

// For signed-in staff looking at the shop: where to edit the page they are on.
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '/';
  const api = await staffApi();

  const product = /^\/products\/([^/]+)\/?$/.exec(path)?.[1];
  if (product) {
    const { data = [] } = await api.GET('/admin/products', {
      params: { query: { search: product } },
    });
    const match = data.find((entry) => entry.handle === product);
    return match
      ? NextResponse.json({ href: `/admin/products/${match.id}/`, label: 'Edit this product' })
      : nothing();
  }

  const target = contentFor(path);
  if (!target) return nothing();
  const { data: documents } = await api.GET('/content/documents', {
    params: { query: { type: target.type } },
  });
  if (!documents) return nothing();
  const match = documents.find((document) => document.key === target.key);
  if (match) {
    return NextResponse.json({ href: `/content/edit/${match.id}/`, label: 'Edit this page' });
  }
  return target.type === 'range-page'
    ? nothing()
    : NextResponse.json({ href: `/content/${target.type}/`, label: 'Add this page to Content' });
}
