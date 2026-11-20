import type { Navigation, SiteSettings } from './navigation';

const at = (label: string, href: string) => ({ label, href });

// The current talasey.co.uk menu, pointed at the new site's pages. Used until the menu is
// published in /content, and as the starting point for editing it there.
export const defaultNavigation: Navigation = {
  menu: [
    {
      label: 'Landscaping Materials',
      href: null,
      sections: [
        {
          label: 'Paving',
          href: '/paving/',
          links: [
            at('Stone paving', '/natural-stone-paving/'),
            at('Porcelain paving', '/porcelain-paving/'),
            at('Paving installation', '/paving-installation/'),
          ],
        },
        {
          label: 'Decking',
          href: '/composite-decking/',
          links: [
            at('Composite decking', '/composite-decking/'),
            at('Pioneer advanced composite decking', '/pioneer-decking/'),
            at('Decking installation', '/decking-installation/'),
          ],
        },
        {
          label: 'Fencing, Gates & Balustrades',
          href: '/composite-fencing/',
          links: [
            at('Composite gates', '/composite-gates/'),
            at('Composite fencing', '/composite-fencing/'),
            at('Fence kit builder', '/fence-builder/composite-fencing/'),
            at('Balustrades', '/balustrades/'),
          ],
        },
        { label: 'Garden Edging', href: '/garden-edging/', links: [] },
        {
          label: 'Walling & Cladding',
          href: '/walling-and-cladding/',
          links: [
            at('Composite cladding', '/composite-cladding/'),
            at('Porcelain cladding', '/porcelain-cladding/'),
            at('Stone walling', '/stone-walling/'),
          ],
        },
        { label: 'Cleaners & Sealers', href: '/cleaners-and-sealers/', links: [] },
        { label: 'Drainage', href: '/drainage/', links: [] },
        { label: 'Artificial Grass', href: '/artificial-grass/', links: [] },
      ],
    },
    {
      label: 'Outdoor Living',
      href: null,
      sections: [
        {
          label: 'Pergolas',
          href: '/pergolas/',
          links: [at('Build your own pergola', '/pergolas/#build-your-own')],
        },
        { label: 'Fire Pits', href: '/fire-pits/', links: [] },
        { label: 'Outdoor Lighting', href: '/outdoor-lighting/', links: [] },
        { label: 'Outdoor Furniture', href: '/garden-furniture/', links: [] },
        { label: 'Outdoor Kitchens', href: '/outdoor-kitchens/', links: [] },
        { label: 'Garden Storage', href: '/garden-storage/', links: [] },
        { label: 'Garden Rooms', href: '/garden-rooms/', links: [] },
      ],
    },
    {
      label: 'Architectural Steelwork',
      href: null,
      sections: [
        { label: 'Planters', href: '/planters/', links: [] },
        { label: 'Water Features', href: '/water-features/', links: [] },
        { label: 'Screens', href: '/garden-screens/', links: [] },
        { label: 'Sculptures', href: '/garden-sculptures/', links: [] },
      ],
    },
    { label: 'Custom Made', href: '/custom-made/', sections: [] },
    {
      label: 'Professionals',
      href: null,
      sections: [
        { label: 'Talasey Partner Programme', href: '/talasey-partner-programme/', links: [] },
        {
          label: 'Talasey Training Academy',
          href: '/talasey-training-academy/',
          links: [
            at('Product awareness courses', '/product-awareness-courses/'),
            at('Product installation courses', '/product-installation-courses/'),
          ],
        },
        { label: 'Talasey On Tour', href: '/talasey-on-tour/', links: [] },
      ],
    },
    {
      label: 'Help & Advice',
      href: null,
      sections: [
        {
          label: 'Installation & Technical Guides',
          href: '/guides/',
          links: [
            at('FAQs', '/help/'),
            at('Health & safety', '/health-safety/'),
            at('Installation & technical guide', '/installation-technical-guide/'),
            at('Product warranty / guarantee', '/product-warranty-guarantee/'),
          ],
        },
        { label: 'Know Before You Buy', href: '/know-before-you-buy/', links: [] },
        { label: 'Product Gallery', href: '/inspiration/', links: [] },
        { label: 'Help me choose', href: '/product-finder/', links: [] },
      ],
    },
    {
      label: 'About',
      href: null,
      sections: [
        { label: 'About Talasey', href: '/about-talasey/', links: [] },
        { label: 'Careers', href: '/careers-at-talasey/', links: [] },
        { label: 'News & blogs', href: '/guides/', links: [] },
        { label: 'Contact us', href: '/contact/', links: [] },
      ],
    },
  ],
  header: [
    at('Free samples', '/samples/'),
    at('Our brochures', 'https://talasey.co.uk/brochures/'),
    at('News', '/guides/'),
    at('About us', '/about-talasey/'),
    at('Contact us', '/contact/'),
  ],
  footer: [
    {
      heading: 'Help & Advice',
      links: [
        at('FAQs', '/help/'),
        at('Health & safety', '/health-safety/'),
        at('Installation & technical guides', '/installation-technical-guide/'),
        at('Product awareness courses', '/product-awareness-courses/'),
        at('Product warranty / guarantee', '/product-warranty-guarantee/'),
      ],
    },
    {
      heading: 'Links',
      links: [
        at('About us', '/about-talasey/'),
        at('Free samples', '/samples/'),
        at('Product finder', '/product-finder/'),
        at('Contact us', '/contact/'),
        at('Terms & conditions', '/terms-and-conditions/'),
      ],
    },
    {
      heading: 'Legal',
      links: [
        at('Privacy and cookie policy', '/privacy-policy/'),
        at('Modern slavery statement', '/modern-slavery-statement/'),
        at('Finance complaints policy', '/finance-complaints-policy/'),
      ],
    },
  ],
};

// From the current site's footer; replaced by "Site settings" in /content once published.
export const defaultSiteSettings: SiteSettings = {
  contactPhone: '0330 333 8030',
  contactEmail: null,
  openingHours: null,
  address: 'St. Vincent House\nNormanby Road\nScunthorpe\nNorth Lincolnshire\nDN15 8QT',
  socialProfiles: [
    'https://www.facebook.com/TalaseyLtd',
    'https://www.linkedin.com/company/2069395',
    'https://www.instagram.com/talaseyltd/',
    'https://uk.pinterest.com/talaseyltd/',
    'https://www.tiktok.com/@talaseyltd',
    'https://www.youtube.com/channel/UClYgvype2cuW9uSU04mGXEw',
  ],
};
