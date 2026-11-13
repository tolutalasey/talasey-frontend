import { NextResponse, type NextRequest } from 'next/server';

// Form results for browsers without JavaScript. A server action stores its result here so the
// page it renders straight after can show the errors; the proxy drops it on the next page load
// so it is only ever shown once.
export const FEEDBACK_COOKIE = 'talasey_form_feedback';

export function withoutFeedback(request: NextRequest): NextResponse {
  if (request.method !== 'GET' || !request.cookies.has(FEEDBACK_COOKIE)) {
    return NextResponse.next();
  }
  request.cookies.delete(FEEDBACK_COOKIE);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.delete(FEEDBACK_COOKIE);
  return response;
}
