import type { Redirect, RedirectSource } from './redirects';

const isRedirect = (value: unknown): value is Redirect => {
  const entry = value as Partial<Redirect> | null;
  return typeof entry?.from === 'string' && typeof entry.to === 'string';
};

// Redirects the content team publishes in /content, on top of the URL map from the old site.
export class ContentRedirectSource implements RedirectSource {
  readonly name = 'content';

  constructor(
    private readonly base: RedirectSource,
    private readonly published: () => Promise<unknown[]>,
  ) {}

  async all(): Promise<Redirect[]> {
    const added = (await this.published()).filter(isRedirect).map((redirect) => ({
      from: redirect.from,
      to: redirect.to,
      permanent: redirect.permanent !== false,
    }));
    const fromContent = new Set(added.map((redirect) => redirect.from));
    return [
      ...(await this.base.all()).filter((redirect) => !fromContent.has(redirect.from)),
      ...added,
    ];
  }
}
