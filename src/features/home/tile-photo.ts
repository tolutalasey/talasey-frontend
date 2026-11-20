import { rangePhoto } from '@/features/catalogue';
import { projectPhoto } from '@/features/content';
import type { ProjectTile } from './content';

const segments = (href: string) => href.split(/[/#?]/).filter(Boolean);

const linkedPhoto = (href: string) => {
  const [first = '', second = ''] = segments(href);
  return first === 'projects'
    ? { src: projectPhoto(second), width: 1600, height: 1200 }
    : rangePhoto(first);
};

// A tile without its own photo shows the photo of the range or project it links to.
export const tilePhoto = (tile: Pick<ProjectTile, 'photo' | 'href' | 'title'>) =>
  tile.photo ?? { ...linkedPhoto(tile.href), alt: tile.title };
