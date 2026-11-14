import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { API_URL, BACKEND_DIR, DEMO_PASSWORD } from '../fixtures/stack.ts';

const run = Date.now().toString(36);
const handle = `alert-test-slab-${run}`;

async function staff(request: APIRequestContext) {
  const { token } = await (
    await request.post(`${API_URL}/auth/sign-in`, {
      data: { email: 'catalogue@talasey.local', password: DEMO_PASSWORD },
    })
  ).json();
  return { authorization: `Bearer ${token}` };
}

async function setStock(request: APIRequestContext, id: string, stockQuantity: number) {
  const headers = await staff(request);
  const product = await (await request.get(`${API_URL}/admin/products/${id}`, { headers })).json();
  const { id: _id, attributes: _a, pimSku: _p, updatedAt: _u, problems: _c, ...input } = product;
  const saved = await request.put(`${API_URL}/admin/products/${id}`, {
    headers,
    data: {
      ...input,
      published: true,
      pageType: '1A',
      stockMode: 'stocked',
      variants: input.variants.map((variant: object) => ({
        ...variant,
        sku: `ALERT-${run}`,
        pricePence: 2500,
        stockQuantity,
      })),
    },
  });
  expect(saved.status()).toBe(200);
}

async function emailsTo(address: string) {
  const outbox = join(BACKEND_DIR, '.data/outbox');
  const files = await readdir(outbox);
  const mails = await Promise.all(files.map((file) => readFile(join(outbox, file), 'utf8')));
  return mails.filter((mail) => mail.includes(address));
}

test('someone asks to hear when an option is back, and gets one email when it is', async ({
  page,
  request,
}) => {
  const headers = await staff(request);
  const created = await request.post(`${API_URL}/admin/products`, {
    headers,
    data: { title: `Alert test slab ${run}`, handle },
  });
  const { id } = await created.json();
  await setStock(request, id, 0);

  const email = `waiting-${run}@example.com`;
  await expect(async () => {
    await page.goto(`/products/${handle}/`);
    await expect(page.getByText("Email me when it's back")).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole('textbox', { name: "Email me when it's back" }).fill('nope');
  await page.getByRole('button', { name: 'Email me' }).click();
  await expect(page.getByText('Enter an email address like name@example.com')).toBeVisible();

  await page.getByRole('textbox', { name: "Email me when it's back" }).fill(email);
  await page.getByRole('button', { name: 'Email me' }).click();
  await expect(page.getByRole('status')).toContainText(`We'll email ${email} once`);

  await setStock(request, id, 4);
  await expect.poll(async () => (await emailsTo(email)).length, { timeout: 10_000 }).toBe(1);
  expect((await emailsTo(email))[0]).toContain(`/products/${handle}/`);
});
