import type { ReactNode } from 'react';
import {
  CompassIcon,
  DocumentIcon,
  HomeIcon,
  ImageIcon,
  LayersIcon,
  LinkIcon,
  MailIcon,
  PoundIcon,
  ProductsIcon,
  QuestionIcon,
  ScaleIcon,
  SettingsIcon,
  SwatchIcon,
} from '@/features/staff';

export type ContentGroup = 'Pages' | 'Help and ideas' | 'Site' | 'Wording';

export const CONTENT_GROUPS: ContentGroup[] = ['Pages', 'Help and ideas', 'Site', 'Wording'];

interface TypeMeta {
  group: ContentGroup;
  icon: ReactNode;
  text: string;
}

const META: Record<string, TypeMeta> = {
  home: { group: 'Pages', icon: <HomeIcon />, text: 'The main heading, introduction and buttons.' },
  'brand-page': { group: 'Pages', icon: <SwatchIcon />, text: 'A page for each brand.' },
  'project-page': { group: 'Pages', icon: <LayersIcon />, text: 'Pages about garden projects.' },
  'range-page': {
    group: 'Pages',
    icon: <DocumentIcon />,
    text: 'The text on range and category pages.',
  },
  'product-extras': {
    group: 'Pages',
    icon: <ProductsIcon />,
    text: 'Extra content shown on product pages.',
  },
  guide: { group: 'Help and ideas', icon: <CompassIcon />, text: 'Guides and buying advice.' },
  faq: {
    group: 'Help and ideas',
    icon: <QuestionIcon />,
    text: 'Questions and answers for shoppers.',
  },
  inspiration: {
    group: 'Help and ideas',
    icon: <ImageIcon />,
    text: 'Inspiration photos and their captions.',
  },
  navigation: { group: 'Site', icon: <LayersIcon />, text: 'The links in the site menus.' },
  'site-settings': {
    group: 'Site',
    icon: <SettingsIcon />,
    text: 'Phone, email, opening hours and social profiles.',
  },
  redirect: { group: 'Site', icon: <LinkIcon />, text: 'Old addresses and where they now go.' },
  email: { group: 'Wording', icon: <MailIcon />, text: 'The wording of emails customers get.' },
  legal: {
    group: 'Wording',
    icon: <ScaleIcon />,
    text: 'Approved wording. Only the owner publishes it.',
  },
  finance: {
    group: 'Wording',
    icon: <PoundIcon />,
    text: 'Approved wording. Only the owner publishes it.',
  },
};

const FALLBACK: TypeMeta = { group: 'Site', icon: <DocumentIcon />, text: '' };

export const typeMeta = (type: string): TypeMeta => META[type] ?? FALLBACK;
