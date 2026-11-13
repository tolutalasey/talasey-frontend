import 'server-only';
import { getRanges, rangePath } from '@/features/catalogue';
import {
  brandPagePath,
  getBrandPages,
  getGuides,
  guidePath,
  HELP_TOPICS,
  helpPath,
} from '@/features/content';
import { searchProducts } from '@/features/search';
import { absoluteUrl, site } from '@/lib/site';

const link = (title: string, path: string, note?: string) =>
  `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ''}`;

// llms.txt (PRD section 14): a plain map of the site for AI tools. Cheap to publish; nothing is
// expected of it. Lists only pages that are live and indexable.
export async function llmsText(): Promise<string> {
  const [ranges, brands, guides] = await Promise.all([getRanges(), getBrandPages(), getGuides()]);
  const stocked = (
    await Promise.all(
      ranges.map(async (range) =>
        (await searchProducts({ scope: range.scope, pageSize: 1 })).total > 0 ? [range] : [],
      ),
    )
  ).flat();

  const section = (heading: string, lines: string[]) =>
    lines.length > 0 ? [`## ${heading}`, ...lines, ''] : [];

  return [
    `# ${site.name}`,
    '',
    `> ${site.legalName} sells paving, decking, garden screens, lighting and outdoor living products to UK homeowners, with prices including VAT and delivery across the UK.`,
    '',
    ...section(
      'Products',
      stocked.map((range) => link(range.name, rangePath(range), range.intro)),
    ),
    ...section(
      'Brands',
      brands
        .filter((brand) => !brand.placeholder)
        .map((brand) => link(brand.name, brandPagePath(brand))),
    ),
    ...section(
      'Guides',
      guides
        .filter((guide) => !guide.placeholder)
        .map((guide) => link(guide.title, guidePath(guide), guide.answer)),
    ),
    ...section('Help', [
      ...HELP_TOPICS.map((topic) => link(topic.name, helpPath(topic))),
      link('Contact us', '/contact/'),
    ]),
  ].join('\n');
}
