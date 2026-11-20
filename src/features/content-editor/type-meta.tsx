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
  page: {
    group: 'Pages',
    icon: <DocumentIcon />,
    text: 'Plain pages such as About, Careers and the policies.',
  },
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
  'pergola-builder': {
    group: 'Pages',
    icon: <LayersIcon />,
    text: 'Sizes, SKUs and side options for each pergola builder.',
  },
  'fence-builder': {
    group: 'Pages',
    icon: <LayersIcon />,
    text: 'Styles, heights, posts and extras for each fence kit builder.',
  },
  'product-finder': {
    group: 'Help and ideas',
    icon: <CompassIcon />,
    text: 'The answers in the product finder and what each one favours.',
  },
  guide: { group: 'Help and ideas', icon: <CompassIcon />, text: 'Guides and buying advice.' },
  'news-post': {
    group: 'Help and ideas',
    icon: <DocumentIcon />,
    text: 'News and blog articles, with their categories.',
  },
  faq: {
    group: 'Help and ideas',
    icon: <QuestionIcon />,
    text: 'Questions and answers for shoppers.',
  },
  'hub-document': {
    group: 'Help and ideas',
    icon: <DocumentIcon />,
    text: 'PDFs in the Knowledge Hub: guides, data sheets and declarations.',
  },
  video: {
    group: 'Help and ideas',
    icon: <ImageIcon />,
    text: 'YouTube videos in the Knowledge Hub and on product pages.',
  },
  brochure: {
    group: 'Help and ideas',
    icon: <DocumentIcon />,
    text: 'The brochures on the brochures page, with their Flipsnack links.',
  },
  acknowledgement: {
    group: 'Help and ideas',
    icon: <ImageIcon />,
    text: 'Installers thanked for the photos in our brochures.',
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
