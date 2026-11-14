'use server';

import { createApiClient } from '@/api-client';
import { refresh } from 'next/cache';
import { apiUrl } from '@/lib/commerce';
import { settle } from '@/lib/form-feedback.server';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Email me when it's back". The answer comes back through the feedback cookie and the page is
// drawn again, so it works with or without JavaScript (ADR 0020).
export async function askForStockAlert(form: FormData) {
  const email = String(form.get('email') ?? '').trim();
  const variantId = String(form.get('variantId') ?? '');
  if (!EMAIL.test(email)) {
    await settle('alert', {
      fieldErrors: { email: 'Enter an email address like name@example.com' },
      values: { email },
    });
    refresh();
    return;
  }
  const { data, error } = await createApiClient({ baseUrl: apiUrl() }).POST('/store/stock-alerts', {
    body: { variantId, email },
  });
  await settle(
    'alert',
    error || !data
      ? { message: 'That option is no longer sold. Choose another.', values: { email } }
      : {
          notice:
            data.status === 'waiting'
              ? `Thanks. We'll email ${email} once, when it's back in stock.`
              : "Good news: it's available now. Add it to your basket above.",
        },
  );
  refresh();
}
