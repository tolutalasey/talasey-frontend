import { NextResponse, type NextRequest } from 'next/server';
import { completeBasket } from '@/features/checkout';

// Stripe sends the shopper here after a payment that needed another page, such as a bank's
// security check or Klarna. The API checks the payment with Stripe before it places the order.
export async function GET(request: NextRequest) {
  const placed = await completeBasket();
  const target = placed.ok ? `/order/${placed.value}/` : '/checkout/?payment=failed';
  return NextResponse.redirect(new URL(target, request.url), 303);
}
