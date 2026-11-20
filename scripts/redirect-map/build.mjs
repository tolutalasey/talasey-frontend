// Builds the redirect map from every address in the current site's sitemaps to its new home.
// Run it again whenever products are added, so old product links reach the product itself:
//   API_URL=https://… node scripts/redirect-map/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const root = (path) => here(`../../${path}`);
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const words = (slug) => slug.split('-').filter(Boolean);

const oldUrls = readFileSync(here('old-site-urls.txt'), 'utf8')
  .trim()
  .split('\n')
  .map((line) => {
    const [kind, path] = line.split(' ');
    return { kind, path };
  });

const newsSlugs = new Set(
  JSON.parse(readFileSync(root('src/features/news/fallback-posts.json'), 'utf8')).map(
    (post) => post.slug,
  ),
);
const videoSlugs = new Set(
  [
    ...readFileSync(root('src/features/knowledge-hub/fallback-videos.ts'), 'utf8').matchAll(
      /video\(\s*'[^']+',\s*'([^']+)'/g,
    ),
  ].map(([, title]) => slugify(title)),
);
const products = await fetch(`${API_URL}/store/products`).then((response) => {
  if (!response.ok) throw new Error(`Products: HTTP ${response.status} from ${API_URL}`);
  return response.json();
});
const handles = products.map((product) => product.handle);

// Each colour of a product sold in several has its own page, like the current site's colour pages.
const colourPages = products.flatMap((product) => {
  const colours = product.options.find((option) => option.title === 'Colour')?.values ?? [];
  if (colours.length < 2) return [];
  return colours.map((colour) => ({
    path: `/products/${product.handle}/${slugify(colour)}/`,
    colourWords: words(slugify(colour)),
    allWords: [...words(product.handle), ...words(slugify(colour))],
  }));
});

// The colour page an old colour product became: every word of the old address is in the product
// and colour, and the colour's own words are all in the old address.
function colourPageFor(slug) {
  const wanted = words(slug);
  return (
    colourPages.find(
      (page) =>
        page.colourWords.every((word) => wanted.includes(word)) &&
        wanted.every((word) => page.allWords.includes(word)),
    )?.path ?? null
  );
}

// Old pages and where they live now. Leaving a page out keeps it as it is, for a page that is
// built under the same address or still to be added in /content.
const PAGES = {
  '/faqs/': '/help/',
  '/news-blogs/': '/news/',
  '/product-gallery/': '/inspiration/',
  '/be-inspired/': '/inspiration/',
  '/downloads/': '/knowledge-hub/',
  '/installation-technical-guide/': '/knowledge-hub/?type=Installation+%26+Technical+Guides',
  '/sample-service/': '/samples/',
  '/paragolas/': '/pergolas/',
  '/pioneer-advanced-composite-decking/': '/pioneer-decking/',
  '/learn-about-pioneer/': '/pioneer-decking/',
  '/pioneer-pro-l/': '/pioneer-decking/',
  '/pioneer-enquiry-form/': '/contact/',
  '/bespoke-services/': '/custom-made/',
  '/bespoke-paving/': '/custom-made/',
  '/designer-installer-network/': '/find-an-installer/',
  '/resiscape/': '/paving/',
  '/supporting-our-industry/': '/about-talasey/',
  '/order-recieved/': '/',
  '/thank-you/': '/',
};

const NEWS_CATEGORIES = {
  'company-updates': 'Company Updates',
  'product-updates': 'Product Updates',
  educational: 'Educational',
  'new-appointments': 'New Appointments',
  'competitions-awards': 'Competitions & Awards',
  'tips-advice': 'Tips & Advice',
  training: 'Training',
  interviews: 'Interviews',
  'case-studies': 'Case Studies',
  inspirational: 'Inspirational',
  events: 'Events',
};

const HUB_TYPES = {
  'declaration-of-performance': 'Declaration of Performance',
  'installation-technical-guides': 'Installation & Technical Guides',
  'specification-sheets': 'Specification Sheets',
  'safety-data-sheets': 'Safety Data Sheets',
  'comparison-charts': 'Comparison Charts',
};

const HUB_RANGES = {
  'natural-stone': 'Natural Stone',
  porcelain: 'Porcelain',
  'composite-products': 'Composite Products',
  'artificial-grass': 'Artificial Grass',
  installation: 'Installation',
  cleaners: 'Cleaners',
  sealers: 'Sealers',
  'finishing-touches': 'Finishing Touches',
};

const query = (path, key, value) => `${path}?${new URLSearchParams({ [key]: value })}`;

// The range page for an old product or range, by the words in its address. First match wins.
const RANGES = [
  [/porcelain-cladding|^rok\b|-rok-/, '/porcelain-cladding/'],
  [/cladding|shadow-gap/, '/composite-cladding/'],
  [/gate/, '/composite-gates/'],
  [/fenc|trellis|post-cap|post-skirt|post-light|concrete-post|angle-post/, '/composite-fencing/'],
  [/pioneer|advanced-decking|starborn|hulk|depth-control/, '/pioneer-decking/'],
  [/decking-installation/, '/decking-installation/'],
  [/deck|terrafuzion|hunter|lifespan|beams|joist|fixing-screws/, '/composite-decking/'],
  [/grass|putt|weed-membrane|u-pins|^luxury|^premium|^eco/, '/artificial-grass/'],
  [/pergola|origin|prestige|wind-screen|heating|led-lighting-kits/, '/pergolas/'],
  [/fire-pit/, '/fire-pits/'],
  [
    /light|transformer|cable|timer|smart-plug|glare|bollard|remote-controller/,
    '/outdoor-lighting/',
  ],
  [/drain|grate|catch-basin|grill/, '/drainage/'],
  [/porcelain-edging|cava-quartz-edging/, '/porcelain-paving/'],
  [/edg|kerb-restraint/, '/garden-edging/'],
  [
    /clean|seal|remover|back-to-black|salt-eraser|green-off|haze|protector/,
    '/cleaners-and-sealers/',
  ],
  [/joint|grout|slurry|gravelset|sand-set|mortar/, '/paving-jointing/'],
  [/riser|wedge|blade|pad|handle|applicator|tools|brush|install/, '/paving-installation/'],
  [/walling|coping/, '/stone-walling/'],
  [/planter|^linea|^orta|^sienna/, '/planters/'],
  [/screen|wall-art/, '/garden-screens/'],
  [
    /stone|sandstone|limestone|slate|york|granite|basalt|clay-paver|pavers|setts|sets|cobble|circle-kit|kerb|flagstone|premiastone|natural/,
    '/natural-stone-paving/',
  ],
  [
    /porcelain|anno|aragon|bellezza|bellstone|cava|colosso|di-pietra|dusk|sofia/,
    '/porcelain-paving/',
  ],
];

// Decorative screens kept their design names; on the new site each name ends "decorative-screen".
const SCREEN_NAMES = new Set(
  handles
    .filter((handle) => handle.endsWith('-decorative-screen'))
    .map((h) => h.replace(/-decorative-screen$/, '')),
);

const rangeFor = (slug) => RANGES.find(([pattern]) => pattern.test(slug))?.[1] ?? null;

// The new product an old one became: the same address, or the one whose address holds every word
// of the old one (with the fewest extra words).
function productFor(slug) {
  if (handles.includes(slug)) return slug;
  if (SCREEN_NAMES.has(slug)) return `${slug}-decorative-screen`;
  const wanted = words(slug);
  const containing = handles
    .filter((handle) => wanted.every((word) => words(handle).includes(word)))
    .sort((a, b) => words(a).length - words(b).length);
  return containing[0] ?? null;
}

const unmapped = [];

function targetFor({ kind, path }) {
  const slug = path.split('/').filter(Boolean).at(-1) ?? '';
  switch (kind) {
    case 'post':
      if (path === '/blogs/') return '/news/';
      return newsSlugs.has(slug) ? `/news/${slug}/` : '/news/';
    case 'page':
      return PAGES[path] ?? null;
    case 'download':
      return '/knowledge-hub/';
    case 'recent-video':
      return videoSlugs.has(slug) ? `/videos/${slug}/` : '/videos/';
    case 'post-archive':
      return {
        '/brochure/': '/brochure-acknowledgements/',
        '/knowledgehub-doc/': '/knowledge-hub/',
        '/recent-video/': '/videos/',
      }[path];
    case 'category':
      return NEWS_CATEGORIES[slug] ? query('/news/', 'category', NEWS_CATEGORIES[slug]) : '/news/';
    case 'knowledgehub-document-type':
      if (slug === 'video') return '/videos/';
      return HUB_TYPES[slug]
        ? query('/knowledge-hub/', 'type', HUB_TYPES[slug])
        : '/knowledge-hub/';
    case 'knowledgehub-product-range':
      return HUB_RANGES[slug]
        ? query('/knowledge-hub/', 'range', HUB_RANGES[slug])
        : '/knowledge-hub/';
    case 'product_cat':
      return (
        {
          'natural-stone': '/natural-stone-paving/',
          porcelain: '/porcelain-paving/',
          'composite-solutions': '/composite-decking/',
          'artificial-grass': '/artificial-grass/',
          'clay-pavers': '/natural-stone-paving/',
          'install-maintain': '/paving-installation/',
          'finishing-touches': '/garden-screens/',
        }[slug] ?? '/'
      );
    case 'product': {
      const colourPage = colourPageFor(slug);
      if (colourPage) return colourPage;
      const product = productFor(slug);
      if (product) return `/products/${product}/`;
      break;
    }
    case 'product-range': {
      const named = {
        'finishing-touches': '/garden-screens/',
        'natural-stone': '/natural-stone-paving/',
        'flagstone-paving': '/natural-stone-paving/',
        'blocks-cobbles': '/natural-stone-paving/',
        'composite-solutions': '/composite-decking/',
        traditional: '/composite-cladding/',
        accessories: '/composite-decking/',
      }[slug];
      if (named) return named;
      // A range such as Anno Lite is now one product with a page per colour.
      const listed = colourPages.find((page) => page.path.startsWith(`/products/${slug}-`));
      if (listed) return listed.path.replace(/[^/]+\/$/, '');
      break;
    }
  }
  const range = rangeFor(slug);
  if (range) return range;
  unmapped.push(path);
  return '/';
}

// Whole sections of the old site with no page of their own here.
const SECTIONS = [
  { from: '/brochure/*', to: '/brochure-acknowledgements/', permanent: true },
  { from: '/knowledgehub-doc/*', to: '/knowledge-hub/', permanent: true },
  { from: '/product/*', to: '/', permanent: true },
];

const redirects = oldUrls.flatMap((url) => {
  const to = targetFor(url);
  return to && to !== url.path ? [{ from: url.path, to, permanent: true }] : [];
});

writeFileSync(
  root('src/lib/redirects/old-site-redirects.json'),
  `${JSON.stringify([...redirects, ...SECTIONS], null, 2)}\n`,
);

const toProducts = redirects.filter((r) => r.to.startsWith('/products/')).length;
const toColours = redirects.filter((r) => /^\/products\/[^/]+\/[^/]+\/$/.test(r.to)).length;
const oldProducts = oldUrls.filter((url) => url.kind === 'product').length;
const kept = oldUrls.filter((url) => url.kind === 'page' && !targetFor(url));
console.log(`${redirects.length} redirects written, plus ${SECTIONS.length} whole sections.`);
console.log(
  `${toProducts} of ${oldProducts} old products reach their new product page (${toColours} of them a colour page); the rest go to their range.`,
);
console.log(`Pages kept at the same address: ${kept.map((url) => url.path).join(' ')}`);
if (unmapped.length) console.log(`Sent to the homepage, no better match: ${unmapped.join(' ')}`);
