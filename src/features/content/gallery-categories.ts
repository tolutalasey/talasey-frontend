import { slugify } from '@/lib/slug';

// The gallery's sections, in Amy's order, with her words for each (Website Gallery sheet).
export const GALLERY_CATEGORIES = [
  {
    name: 'Low Maintenance Spaces',
    intro:
      'Take a look at inspiring outdoor spaces designed to look great without demanding hours of upkeep. Discover ideas for creating a beautiful garden that’s easy to enjoy and maintain.',
  },
  {
    name: 'Traditional Gardens',
    intro:
      'Be inspired by timeless gardens that embrace natural materials, classic details and plenty of character. Take a look at ideas for creating an outdoor space with a traditional, welcoming feel.',
  },
  {
    name: 'Contemporary Gardens',
    intro:
      'Take a look at contemporary outdoor spaces where clean lines, modern materials and thoughtful design come together. Be inspired by sleek and stylish ideas for creating a modern garden.',
  },
  {
    name: 'Stylish Entryways',
    intro:
      'Be inspired by beautiful entryways that create a warm welcome from the moment you arrive. Take a look at ideas for stylish paths, driveways and entrances that make a lasting first impression.',
  },
  {
    name: 'Unique Features',
    intro:
      'Take a look at outdoor spaces brought to life with distinctive features and creative details. Be inspired by ideas that add personality, interest and something truly unique to your garden.',
  },
  {
    name: 'Garden Structures',
    intro:
      'Be inspired by gardens that make the most of structure, shelter and space. Take a look at ideas featuring pergolas, screens, seating areas and other architectural additions.',
  },
  {
    name: 'Finishing Touches',
    intro:
      'Take a look at the finer details that can transform an outdoor space. Be inspired by planters, edging, lighting and decorative features that bring your garden design together.',
  },
].map((category) => ({ ...category, slug: slugify(category.name) }));

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const [FIRST_GALLERY_CATEGORY] = GALLERY_CATEGORIES as [GalleryCategory, ...GalleryCategory[]];
