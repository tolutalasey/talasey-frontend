// Plain colour groups for the Colour filter, so shoppers pick "Grey" rather than a range's own
// colour names such as Athos or Cronus. Names read from swatch photos are listed; any other
// colour is grouped by the words in its name, and left out of the filter if none match.
const NAMED: Record<string, string> = {
  pearl: 'White & cream',
  grey: 'Grey',
  buff: 'Beige',
  desert: 'Beige',
  dove: 'Grey',
  smoke: 'Grey',
  'kandla grey': 'Grey',
  'york stone': 'Beige',
  'raj green': 'Green',
  'fossil mint': 'Beige',
  ravana: 'Grey',
  thea: 'Charcoal & black',
  athos: 'Grey',
  charis: 'Beige',
  cronus: 'Grey',
  tempesta: 'Grey',
  cenere: 'Grey',
  terra: 'Grey',
  lune: 'Grey',
  montagne: 'Beige',
  stelle: 'Charcoal & black',
  'antique grey': 'Grey',
  'black carbon': 'Charcoal & black',
  'brown cedar': 'Brown',
};

const BY_WORD: { family: string; words: RegExp }[] = [
  { family: 'Charcoal & black', words: /\b(black|charcoal|anthracite|ebony|nero|carbon|jet)\b/i },
  { family: 'White & cream', words: /\b(white|cream|ivory|pearl|bianco|snow)\b/i },
  { family: 'Grey', words: /\b(gr[ae]y|silver|graphite|smoke|slate|ash|steel|platinum|dove)\b/i },
  { family: 'Brown', words: /\b(brown|cedar|walnut|teak|mocha|espresso|rust|corten|chestnut)\b/i },
  {
    family: 'Beige',
    words: /\b(beige|buff|sand|desert|oak|honey|stone|natural|autumn|harvest)\b/i,
  },
  { family: 'Green', words: /\b(green|sage|olive|moss)\b/i },
  { family: 'Blue', words: /\bblue\b/i },
  { family: 'Red', words: /\b(red|terracotta)\b/i },
];

export function colourFamily(colour: string): string | null {
  const named = NAMED[colour.trim().toLowerCase()];
  if (named) return named;
  return BY_WORD.find(({ words }) => words.test(colour))?.family ?? null;
}
