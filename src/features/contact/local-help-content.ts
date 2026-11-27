import type { LocalHelpKind } from './local-help';

export interface Point {
  title: string;
  text: string;
}

export interface Section {
  eyebrow?: string;
  heading: string;
  text?: string;
  points?: Point[];
  steps?: Point[];
  list?: string[];
  counts?: { label: string; count: number }[];
  action?: { label: string; href: string };
}

export interface LocalHelpContent {
  eyebrow: string;
  heading: string;
  lead: string;
  sections: Section[];
  faqs: { question: string; answer: string }[];
}

// The sections of the current site's stockist and installer pages, in the same order.
export const LOCAL_HELP_CONTENT: Partial<Record<LocalHelpKind, LocalHelpContent>> = {
  stockist: {
    eyebrow: '2,000+ stockists nationwide',
    heading: 'Find your nearest Talasey stockist',
    lead: 'Our entire range of landscaping product brands are available through our network of merchants and stockists. Contact us today and a friendly member of our team can inform you of your nearest Talasey stockist.',
    sections: [
      {
        heading: 'Why visit a stockist?',
        text: 'Specifications and swatch cards only tell part of the story. Stone, porcelain and timber reveal their true character in natural light, at full scale, alongside the materials they’ll sit next to.',
        steps: [
          {
            title: 'See full-size boards',
            text: 'Review entire pallets, colour batches and texture variations in person.',
          },
          {
            title: 'Expert specification',
            text: 'Trained merchants help you size up, calculate falls, joints and edge details.',
          },
          {
            title: 'Same-day collection',
            text: 'Most stockists carry live inventory ready for trade pickup or local delivery.',
          },
        ],
      },
      {
        eyebrow: 'Coverage by region',
        heading: 'A merchant within reach, wherever you build',
        text: 'From the Highlands to Cornwall, our partner network covers every postcode in mainland UK with extended cover in Ireland and the islands.',
        action: { label: 'Order your samples now', href: '/samples/' },
      },
      {
        eyebrow: 'Trade partnership',
        heading: 'Want to stock Talasey products?',
        text: 'Join our network of merchants and unlock trade pricing, marketing support and a dedicated account manager.',
        list: [
          'Dedicated regional account manager',
          'Point-of-sale & display support',
          'Priority access to new product ranges',
          'Co-branded marketing materials',
        ],
        action: { label: 'Become a stockist', href: '/contact/?topic=trade' },
      },
    ],
    faqs: [
      {
        question: 'Do all stockists carry the entire Talasey range?',
        answer:
          'Most carry the core porcelain and natural paving lines. Showroom partners display the complete range including walling, decking and artificial grass.',
      },
      {
        question: 'Can I order samples directly from a stockist?',
        answer:
          'Yes — your local stockist holds physical swatches. You can also order up to 3 free samples direct from us for home delivery.',
      },
      {
        question: 'Do stockists deliver to site?',
        answer:
          'Most trade merchants offer pallet delivery within a 25-mile radius. Confirm lead times and minimum order quantities directly with the merchant.',
      },
      {
        question: 'Is pricing the same across all stockists?',
        answer:
          'Recommended retail pricing is consistent, though trade accounts and project quotes vary by merchant. Ask for a written quotation for accurate pricing.',
      },
    ],
  },
  installer: {
    eyebrow: 'Designer & Installer Network',
    heading: 'Find a trusted installer near you',
    lead: 'Tell us about your project and we’ll connect you with a vetted, experienced installer from our nationwide network — familiar with every product we supply.',
    sections: [
      {
        heading: 'From enquiry to installer, in four simple steps',
        text: 'No cold calling, no guesswork. We do the matching so you can focus on choosing the right product for your project.',
        steps: [
          {
            title: 'Tell us your project',
            text: 'Fill in a short form with your postcode, project size, and the product you’re interested in.',
          },
          {
            title: 'We match you locally',
            text: 'Our team reviews your details and identifies installers in our network who cover your area.',
          },
          {
            title: 'Get introduced',
            text: 'We share your details with suitable installers so they can reach out directly with a quote.',
          },
          {
            title: 'Start your project',
            text: 'Compare quotes, choose your installer, and get your landscaping project underway with confidence.',
          },
        ],
      },
      {
        eyebrow: 'Why it matters',
        heading: 'A bad installation can ruin a great product',
        text: 'Premium materials deserve a premium fit. Here’s what sets our network apart from a random search online.',
        points: [
          {
            title: 'Academy-trained',
            text: 'Many of our installers have completed Talasey Training Academy courses — so they know our products inside out, not just landscaping in general.',
          },
          {
            title: 'Vetted before they join',
            text: 'We check credentials, insurance, and past work before any installer is added to the network — so you’re not rolling the dice.',
          },
          {
            title: 'Product-specific expertise',
            text: 'From porcelain paving to resin bound surfacing, you’re matched with installers experienced in your exact product type.',
          },
          {
            title: 'No pressure, no obligation',
            text: 'You receive introductions, not sales calls. Compare quotes and proceed only when you’re ready.',
          },
          {
            title: 'Warranty-backed work',
            text: 'Installations carried out by network professionals help protect your product warranty and guarantee.',
          },
          {
            title: 'Local to your project',
            text: 'We prioritise installers who already work in your region and understand local site conditions.',
          },
        ],
      },
      {
        heading: 'Why homeowners choose our network',
        text: 'Every installer in our Designer & Installer Network is vetted before joining — and many are trained directly through the Talasey Training Academy.',
        list: [
          'Hands-on experience installing Talasey products specifically',
          'Insured, accountable, and reviewed by past customers',
          'Free, no-obligation introductions — you choose who you work with',
          'Local installers who understand regional ground conditions',
        ],
      },
      {
        heading: 'Are you a professional installer?',
        text: 'Join the Talasey Designer & Installer Network and get connected with homeowners actively looking for your expertise.',
        action: { label: 'Join the network', href: '/talasey-partner-programme/' },
      },
    ],
    faqs: [
      {
        question: 'Is this service free?',
        answer:
          'Yes. Submitting your project details and receiving installer introductions costs nothing. You only pay the installer you choose to work with.',
      },
      {
        question: 'Are the installers employed by Talasey?',
        answer:
          'No — they’re independent professionals in our Designer & Installer Network. We vet them but you contract directly with the installer you choose.',
      },
      {
        question: 'Does using an installer affect my product warranty?',
        answer:
          'Using a network-vetted installer helps support your product guarantee. Always confirm specifics with our team for your chosen product range.',
      },
      {
        question: 'How many installers will I be matched with?',
        answer:
          'Typically we introduce you to two to three installers in your area so you can compare availability and quotes.',
      },
    ],
  },
};
