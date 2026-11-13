// PRD section 13 keyword map: each keyword gets one main page and a cluster of supporting pages
// that link to it. Nothing else on the site targets that keyword.
export interface KeywordPage {
  keyword: string;
  path: string;
  supporting: string[];
}

export const keywordMap: KeywordPage[] = [
  {
    keyword: 'porcelain paving',
    path: '/porcelain-paving/',
    supporting: [
      '/porcelain-paving/grey/',
      '/porcelain-paving/white/',
      '/porcelain-paving/black/',
      '/porcelain-paving/wood-effect/',
      '/porcelain-paving/20mm/',
      '/porcelain-paving/large-format/',
      '/brands/vitripiazza/',
      '/guides/porcelain-vs-natural-stone/',
      '/guides/how-to-lay-porcelain-paving/',
      '/guides/is-porcelain-paving-slippery/',
      '/guides/porcelain-patio-cost/',
    ],
  },
  {
    keyword: 'stone paving',
    path: '/natural-stone-paving/',
    supporting: [
      '/natural-stone-paving/indian-sandstone/',
      '/natural-stone-paving/limestone/',
      '/natural-stone-paving/granite/',
      '/natural-stone-paving/slate/',
      '/brands/natural-paving/',
      '/guides/how-to-seal-sandstone/',
      '/guides/sandstone-colours/',
    ],
  },
  {
    keyword: 'composite decking',
    path: '/composite-decking/',
    supporting: [
      '/brands/piranha/',
      '/composite-decking/colours/',
      '/guides/composite-vs-timber-decking-cost/',
      '/guides/how-to-build-a-composite-deck/',
      '/tools/deck-calculator/',
    ],
  },
  {
    keyword: 'composite cladding',
    path: '/composite-cladding/',
    supporting: [
      '/guides/cladding-a-garden-room/',
      '/guides/fixing-composite-cladding/',
      '/composite-cladding/colours/',
    ],
  },
  {
    keyword: 'composite fencing',
    path: '/composite-fencing/',
    supporting: [
      '/composite-fencing/gates/',
      '/guides/composite-vs-timber-fencing/',
      '/guides/fence-wind-loading/',
    ],
  },
  {
    keyword: 'paving jointing compound',
    path: '/paving-jointing/',
    supporting: [
      '/brands/pavetuf/',
      '/guides/best-jointing-for-porcelain/',
      '/guides/how-to-joint-a-patio/',
      '/tools/jointing-calculator/',
      '/guides/jointing-troubleshooting/',
    ],
  },
  {
    keyword: 'pergolas',
    path: '/pergolas/',
    supporting: [
      '/pergolas/3m-x-3m/',
      '/pergolas/4m-x-3m/',
      '/pergolas/louvred/',
      '/pergolas/attached-to-the-house/',
      '/pergolas/with-lighting/',
      '/guides/do-i-need-planning-permission-for-a-pergola/',
    ],
  },
  {
    keyword: 'garden rooms',
    path: '/garden-rooms/',
    supporting: [
      '/garden-rooms/garden-offices/',
      '/guides/garden-room-planning-rules/',
      '/guides/garden-room-cost/',
      '/guides/garden-room-bases-and-groundworks/',
    ],
  },
  {
    keyword: 'planters',
    path: '/planters/',
    supporting: [
      '/planters/corten/',
      '/planters/made-to-measure/',
      '/planters/large/',
      '/planters/raised-beds/',
    ],
  },
  {
    keyword: 'fire pits',
    path: '/fire-pits/',
    supporting: [
      '/fire-pits/steel/',
      '/fire-pits/stone/',
      '/guides/fire-pit-safety-and-siting/',
      '/fire-pits/with-cooking-accessories/',
    ],
  },
  {
    keyword: 'garden sculptures',
    path: '/garden-sculptures/',
    supporting: [
      '/garden-sculptures/water-features/',
      '/garden-sculptures/commissions/',
      '/guides/placing-a-sculpture/',
    ],
  },
];

export const productPath = (handle: string) => `/products/${handle}/`;
