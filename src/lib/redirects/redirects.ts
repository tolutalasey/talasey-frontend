export interface Redirect {
  from: string;
  to: string;
  permanent: boolean;
}

// Where the redirect map comes from. A file in the repo locally; Vercel Edge Config in
// production, so a redirect can be added without a deploy.
export interface RedirectSource {
  readonly name: string;
  all(): Promise<Redirect[]>;
}

export class StaticRedirectSource implements RedirectSource {
  readonly name = 'local file';

  constructor(private readonly redirects: Redirect[]) {}

  async all(): Promise<Redirect[]> {
    return this.redirects;
  }
}

const withoutTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export function redirectMatcher(redirects: Redirect[]) {
  const byPath = new Map(
    redirects.map((redirect) => [withoutTrailingSlash(redirect.from), redirect]),
  );
  return (pathname: string): Redirect | undefined => byPath.get(withoutTrailingSlash(pathname));
}

// Problems that would send people round in circles or through several hops.
export function redirectMapProblems(redirects: Redirect[]): string[] {
  const problems: string[] = [];
  const sources = new Map<string, Redirect>();
  for (const redirect of redirects) {
    const from = withoutTrailingSlash(redirect.from);
    if (!redirect.from.startsWith('/')) problems.push(`${redirect.from} must start with /`);
    if (sources.has(from)) problems.push(`${redirect.from} is redirected twice`);
    sources.set(from, redirect);
  }
  for (const redirect of redirects) {
    const to = withoutTrailingSlash(redirect.to);
    if (to === withoutTrailingSlash(redirect.from)) {
      problems.push(`${redirect.from} redirects to itself`);
    } else if (sources.has(to)) {
      problems.push(
        `${redirect.from} goes to ${redirect.to}, which redirects again; point it at the final page`,
      );
    }
  }
  return problems;
}
