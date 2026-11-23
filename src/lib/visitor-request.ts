// The shopper's address as the host passes it on, for limits kept by the backend.
export const visitorIp = (request: Request) =>
  request.headers.get('x-real-ip') ??
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  null;

// Only the site's own pages may post to its API routes.
export const fromThisSite = (request: Request) => {
  const origin = request.headers.get('origin');
  return !origin || new URL(origin).host === new URL(request.url).host;
};
