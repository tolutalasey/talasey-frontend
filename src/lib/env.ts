import { z } from 'zod';

const requiredInProduction = ['API_URL', 'REVALIDATE_SECRET'] as const;

export const envSchema = z
  .object({
    APP_ENV: z.enum(['development', 'preview', 'staging', 'production']).default('development'),
    SITE_URL: z.url().default('http://localhost:3000'),
    // The backend. The site talks to it from the server only, so it never reaches the browser.
    API_URL: z.url().optional(),
    // Stripe publishable key (pk_...). When set, checkout shows Stripe's payment form; the backend
    // needs STRIPE_SECRET_KEY from the same account. Without it checkout uses the test payment.
    STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
    REVALIDATE_SECRET: z.string().min(32).optional(),
    ALGOLIA_APP_ID: z.string().optional(),
    ALGOLIA_SEARCH_KEY: z.string().optional(),
    ALGOLIA_PRODUCTS_INDEX: z.string().default('products'),
    // PRD section 14: whether crawlers that only collect AI training data may crawl the site.
    AI_TRAINING_CRAWLERS: z.enum(['allow', 'block']).default('allow'),
    INDEXNOW_KEY: z
      .string()
      .regex(/^[a-zA-Z0-9-]{8,128}$/)
      .optional(),
  })
  .superRefine((env, ctx) => {
    if (env.APP_ENV !== 'production') return;
    for (const key of requiredInProduction) {
      if (!env[key])
        ctx.addIssue({ code: 'custom', path: [key], message: 'Required in production' });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const present = Object.fromEntries(Object.entries(source).filter(([, value]) => value !== ''));
  const result = envSchema.safeParse(present);
  if (!result.success) {
    throw new Error(`Invalid site environment:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const env = parseEnv(process.env);
