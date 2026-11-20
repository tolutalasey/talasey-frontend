import type { Brochure } from './schemas';

// The brochures on the current talasey.co.uk, read online on Flipsnack, until they are published in
// /content. The covers are still served from the current site.
const UPLOADS = 'https://talasey.co.uk/wp-content/uploads/';
const FLIPSNACK = 'https://www.flipsnack.com/5A8B7E77C6F/';

const brochure = (
  edition: number,
  title: string,
  summary: string,
  link: string | null,
  cover: string,
): Brochure => ({
  slug: title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
  title,
  edition,
  summary,
  link,
  cover: { src: `${UPLOADS}${cover}`, alt: `${title} brochure cover`, width: 420, height: 420 },
});

export const fallbackBrochures: Brochure[] = [
  brochure(
    1,
    'Porcelain & Natural Stone',
    'Inspiring outdoor spaces in premium, ethically sourced paving.',
    `${FLIPSNACK}talasey-ltd-2025-porcelain-stone-brochure-tiyt22e3f2/full-view.html`,
    '2026/07/Knowledge-Hub-Covers-420-x-420-px-rhxl18lf9odqbbp3ba28hoeggq1cvj087krwe6wodk.png',
  ),
  brochure(
    2,
    'Composite & Artificial Grass',
    'Piranha decking and Luxigraze: stylish, hard-wearing, low-maintenance.',
    `${FLIPSNACK}talasey-ltd-2025-composite-grass-brochure-zuj299n7t9/full-view.html`,
    '2026/07/Knowledge-Hub-Covers-420-x-420-px-1-rhxl2kj6y87crfrgjcs7iuayrdh2s3aje61nvaxlk8.png',
  ),
  brochure(
    3,
    'Surfaces',
    'A coffee-table style book of texture, colour and style across Talasey.',
    `${FLIPSNACK}2026-surfaces-brochure_digital`,
    '2026/07/Surfaces-2026-Covers-rnfxv6bwkfqu019qfo9nth348b1eb1u51mplakqzc8-removebg-preview.png',
  ),
  brochure(
    4,
    'Finishing Touches',
    'Sculptures, planters, screens, fire pits and pergolas to complete a project.',
    `${FLIPSNACK}finishing-touches-brochure-by-talasey/full-view.html`,
    '2026/07/Finishing-Touches-Brochure-rcakqq972ictwsylti1pto4n0l3ol85suuzdypoui0.png',
  ),
  brochure(
    5,
    'Lighting',
    'Dellaora plug and play: pre-wired, weather-rated LEDs.',
    `${FLIPSNACK}talasey-lighting-brochure-t9f493urzp`,
    '2026/09/lighting_brochure.png',
  ),
  brochure(
    6,
    'Garden Edging',
    'Clean lines and clear boundaries for a professional finish.',
    `${FLIPSNACK}talasey_edging-brochure-digital`,
    '2026/09/edgin_brochure.png',
  ),
  brochure(
    7,
    'Installation & Maintenance',
    'Pavetuf’s complete range: prep, install, protect and clean.',
    `${FLIPSNACK}talasey-ltd-2025-pavetuf-booklet/full-view.html`,
    '2026/07/Pavetuf-1-rcbei0v8awvm5gug7koembz8c0tref4kt9zmlt9qw8-1.png',
  ),
  brochure(
    8,
    'Pioneer Composite Decking',
    'High-definition wood imaging with aerospace-grade coating technology.',
    `${UPLOADS}2025/02/PIONEER-Digital-Brochure.pdf`,
    '2026/07/Pioneer-rcbegxe0bvdklufsm3m2plxvdu8cf4runul8g6wa5k-1.png',
  ),
  brochure(
    9,
    'Pergolas',
    'Find inspiration for creating a stylish outdoor space you can enjoy throughout the seasons.',
    `${FLIPSNACK}talasey_pergolas_2026`,
    '2026/09/pergola_brochure.png',
  ),
  brochure(10, 'Garden Rooms', 'Coming soon.', null, '2026/09/Brochure-Covers-1.png'),
  brochure(
    11,
    'Screens & Planters',
    'Find stylish ways to add structure, privacy and personality to your outdoor space.',
    `${FLIPSNACK}talasey-screens-planters-brochure-2026`,
    '2026/09/planter_screens_brochure.png',
  ),
];
