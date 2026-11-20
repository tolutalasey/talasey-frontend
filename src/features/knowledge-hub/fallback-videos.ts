import type { Video } from './schemas';

// The videos on the current talasey.co.uk Knowledge Hub, until they are published in /content.
const video = (
  youtube: string,
  title: string,
  ranges: Video['ranges'],
  publishedOn: string,
): Video => ({
  slug: title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
  title,
  youtube,
  summary: null,
  ranges,
  products: [],
  publishedOn,
});

export const fallbackVideos: Video[] = [
  video('9swVybZ-OQ0', 'How to use Gravelset Gravel Binder', ['Installation'], '2026-04-16'),
  video(
    'tsr4HUMj_X8',
    'Pioneer Advanced Composite Decking Clip and Pro Plug System',
    ['Composite Products'],
    '2025-07-17',
  ),
  video(
    'R4ExLaQmT0I',
    'How to Install Traditional Composite Cladding (Horizontal Installation)',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    '2g0HVdWuq5Q',
    'How to Install Traditional Composite Cladding (Vertical Installation)',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    '0v5c-ZoV60I',
    'How to Install Shadow Gap Composite Cladding (Horizontal Installation)',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    'QbzciuwiOeI',
    'How to Install Shadow Gap Composite Cladding (Vertical Installation)',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    '7Hm2SF3zWbw',
    'How to Install Composite Fencing (On A Pre-Built Foundation)',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    'wOB2SFk4OGs',
    'Introducing Piranha Composite Fencing',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    'KWUKXiJe0A8',
    'Piranha Composite Solutions By Talasey Ltd',
    ['Composite Products'],
    '2025-06-16',
  ),
  video(
    'De1hNnYqciM',
    'Luxigraze Artificial Grass by Talasey Ltd',
    ['Artificial Grass'],
    '2025-06-16',
  ),
  video('4KuPui-Gt8I', 'Pavetuf Green-Off', ['Cleaners'], '2025-06-16'),
  video('IAxwUNm3GRw', 'Pavetuf Jointing Compound', ['Installation'], '2025-06-16'),
  video('RK5EUMSrMQo', 'Pavetuf Deep Cleaner', ['Cleaners'], '2025-06-16'),
  video(
    'zsOZuMcf2Us',
    'Pavetuf Landscape Solutions by Talasey Ltd',
    ['Installation', 'Cleaners', 'Sealers'],
    '2025-06-16',
  ),
  video('CIeuF-iaybU', 'Vitripiazza by Talasey Ltd', ['Porcelain'], '2025-06-12'),
  video('yL5G2vCriY8', 'Natural Paving by Talasey Ltd', ['Natural Stone'], '2025-06-12'),
];
