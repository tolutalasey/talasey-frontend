// Colour options for the shop, to compare on real pages before one is chosen. Each sets the
// brand and stone colours that every page is styled from; the current colours are "plum".
export const PALETTE_TOKENS = [
  '--color-brand50',
  '--color-brand600',
  '--color-brand800',
  '--color-brand950',
  '--color-stone',
  '--color-stone50',
  '--color-stone-muted',
  '--color-line',
  '--focus-ring-color',
] as const;

type Token = (typeof PALETTE_TOKENS)[number];

export interface Palette {
  id: string;
  name: string;
  summary: string;
  colours: Record<Token, string>;
}

const colours = (
  brand50: string,
  brand600: string,
  brand800: string,
  brand950: string,
  stone: string,
  stone50: string,
  stoneMuted: string,
  line: string,
): Record<Token, string> => ({
  '--color-brand50': brand50,
  '--color-brand600': brand600,
  '--color-brand800': brand800,
  '--color-brand950': brand950,
  '--color-stone': stone,
  '--color-stone50': stone50,
  '--color-stone-muted': stoneMuted,
  '--color-line': line,
  '--focus-ring-color': brand600,
});

export const CURRENT_PALETTE: Palette = {
  id: 'plum',
  name: 'Plum (now)',
  summary: 'The colours the site uses today, taken from the brochures.',
  colours: colours(
    '#F4ECF5',
    '#6C1B78',
    '#4A0F55',
    '#2B0337',
    '#EFE4DC',
    '#F6F2EF',
    '#C4B2BF',
    '#E8E1DC',
  ),
};

export const PALETTES: Palette[] = [
  {
    id: 'garden',
    name: 'Garden green',
    summary: 'A deep garden green on pale stone. Calm and natural, and close to the products.',
    colours: colours(
      '#EAF2EC',
      '#2F6B4F',
      '#1F4D39',
      '#13301F',
      '#EEE9E0',
      '#F7F5F0',
      '#B9C2B5',
      '#E4E0D6',
    ),
  },
  {
    id: 'slate',
    name: 'Slate and sand',
    summary: 'A blue-grey slate with warm sand. Crisp and modern, and lets the photos lead.',
    colours: colours(
      '#EBF0F3',
      '#34566E',
      '#243D50',
      '#172634',
      '#EFE7DA',
      '#F8F4EE',
      '#B8C0C6',
      '#E6DFD3',
    ),
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    summary: 'A warm clay red on cream. Friendly and sunny, like a garden pot.',
    colours: colours(
      '#F8EDE7',
      '#A0482A',
      '#7A3620',
      '#4A2015',
      '#F1E7DD',
      '#FAF5F0',
      '#CDB6A8',
      '#EADFD4',
    ),
  },
];

export const PALETTE_PARAM = 'palette';
export const PALETTE_STORAGE_KEY = 'talasey-palette-preview';

export const paletteCss = () =>
  PALETTES.map(
    ({ id, colours: set }) =>
      `html[data-palette="${id}"]{${Object.entries(set)
        .map(([token, value]) => `${token}:${value}`)
        .join(';')}}`,
  ).join('');

// Runs before the page paints, so a previewed palette never flashes the current colours. Only
// the palettes above are accepted, from ?palette= or from earlier in the same browser tab.
export const paletteScript = () => {
  const ids = JSON.stringify(PALETTES.map((palette) => palette.id));
  return `(function(){try{var ids=${ids};var k=${JSON.stringify(PALETTE_STORAGE_KEY)};var p=new URLSearchParams(location.search).get(${JSON.stringify(PALETTE_PARAM)});if(p==='off'){sessionStorage.removeItem(k);return;}if(p&&ids.indexOf(p)>-1)sessionStorage.setItem(k,p);var s=sessionStorage.getItem(k);if(s&&ids.indexOf(s)>-1)document.documentElement.dataset.palette=s;}catch(e){}})();`;
};
