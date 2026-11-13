import { suggestProducts } from '@/features/search';

const MAX_QUERY = 100;

// Instant search suggestions for the header. Cached briefly at the edge per query.
export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get('q') ?? '').slice(0, MAX_QUERY);
  const suggestions = await suggestProducts(query, 6);
  return Response.json(suggestions, {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
  });
}
