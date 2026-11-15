// A brochure photo of the same kind of product, shown until the product has a photo of its own.
export interface StandInPhoto {
  src: string;
  width: number;
  height: number;
}

const brand = (name: string, width: number, height: number): StandInPhoto => ({
  src: `/images/brand/${name}.jpg`,
  width,
  height,
});

const BY_KIND: [RegExp, StandInPhoto][] = [
  [/pergola|louvre|wind screen|privacy panel|heater/i, brand('hero-pergola-patio', 1234, 873)],
  [/joint|grout|spacer|slurry|primer|pavetuf|sealer|cleaner/i, brand('jointing', 900, 900)],
  [/planter/i, brand('corten-planter', 900, 900)],
  [/screen/i, brand('project-screens', 1600, 1200)],
  [/light/i, brand('project-lighting', 1600, 1200)],
  [/fire ?pit/i, brand('showcase/13', 720, 510)],
  [/sculpture/i, brand('showcase/04', 720, 510)],
  [/deck|clad|fenc/i, brand('showcase/20', 720, 510)],
  [/anthracite|black|charcoal|dark/i, brand('paving-anthracite', 900, 900)],
  [/buff|sand|gold|harvest/i, brand('paving-buff', 900, 900)],
  [/sandstone|limestone|granite|slate|natural stone/i, brand('project-patio', 1600, 1200)],
  [/grey|gray|silver/i, brand('paving-light-grey', 900, 900)],
  [/porcelain|paving|tile|slab/i, brand('paving-pale-patio', 1600, 1199)],
];

const ANY = brand('samples-mixed', 1600, 1200);

export const standInPhoto = (name: string): StandInPhoto =>
  BY_KIND.find(([kind]) => kind.test(name))?.[1] ?? ANY;
