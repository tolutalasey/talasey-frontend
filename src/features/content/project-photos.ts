// A brochure photo for each garden project, for the menu and anywhere a project needs a picture.
const PHOTOS: Record<string, string> = {
  'new-patio': '/images/brand/project-patio.jpg',
  'composite-deck': '/images/brand/showcase/21.jpg',
  'shade-and-shelter': '/images/brand/hero-pergola-patio.jpg',
  'garden-room': '/images/brand/project-pergola.jpg',
};

export const projectPhoto = (slug: string) => PHOTOS[slug] ?? '/images/brand/samples-mixed.jpg';
