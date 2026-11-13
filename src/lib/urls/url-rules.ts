// PRD section 13 URL rules: short, lowercase, hyphenated, no dates or IDs, and a trailing slash
// on page paths, like /products/vitripiazza-dusk-grey-porcelain-paving/.
export type UrlProblem = string;

const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YEAR = /(?:^|-)(?:19|20)\d{2}(?:-|$)/;
const ID_LIKE = /\d{5,}|[a-f0-9]{8,}/;
const MAX_LENGTH = 80;

export function slugProblems(slug: string): UrlProblem[] {
  const problems: UrlProblem[] = [];
  if (!SEGMENT.test(slug))
    problems.push(`"${slug}" uses something other than lowercase words and single hyphens`);
  if (YEAR.test(slug)) problems.push(`"${slug}" has a date in it`);
  if (ID_LIKE.test(slug)) problems.push(`"${slug}" looks like it has a code or ID in it`);
  if (slug.length > MAX_LENGTH) problems.push(`"${slug}" is longer than ${MAX_LENGTH} characters`);
  return problems;
}

export function pathProblems(path: string): UrlProblem[] {
  if (path === '/') return [];
  if (!path.startsWith('/') || !path.endsWith('/')) {
    return [`${path} should start and end with /`];
  }
  if (/[?#]/.test(path)) return [`${path} has a query or fragment; filters stay out of page paths`];
  return path
    .slice(1, -1)
    .split('/')
    .flatMap((segment) => slugProblems(segment));
}
