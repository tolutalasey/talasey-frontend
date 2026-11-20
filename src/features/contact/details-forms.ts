export type DetailsFormId = 'partner' | 'warranty' | 'contact' | 'product';

export interface DetailsField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'url' | 'textarea';
  required?: boolean;
  autoComplete?: string;
}

export interface DetailsSection {
  heading?: string;
  fields: DetailsField[];
}

export interface DetailsFormSpec {
  kind: 'partner' | 'warranty' | 'contact';
  title: string;
  button: string;
  sent: string;
  sections: DetailsSection[];
}

// These fill the enquiry's own fields; every other answer is listed with its label.
export const CORE_FIELDS = ['name', 'email', 'phone', 'postcode', 'message'] as const;

const name: DetailsField = {
  name: 'name',
  label: 'Full name',
  required: true,
  autoComplete: 'name',
};
const email: DetailsField = {
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  autoComplete: 'email',
};
const message = (label: string, required = false): DetailsField => ({
  name: 'message',
  label,
  type: 'textarea',
  required,
});
const address: DetailsField[] = [
  { name: 'street', label: 'Street address', autoComplete: 'address-line1' },
  { name: 'town', label: 'Town or city', autoComplete: 'address-level2' },
  { name: 'county', label: 'County', autoComplete: 'address-level1' },
  { name: 'postcode', label: 'Postcode', required: true, autoComplete: 'postal-code' },
];
const messageForm: DetailsFormSpec = {
  kind: 'contact',
  title: 'Send us a message',
  button: 'Send message',
  sent: "Thanks, we've got your message and will get back to you as soon as we can.",
  sections: [
    {
      fields: [
        name,
        email,
        { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' },
        message('Your message', true),
      ],
    },
  ],
};

// The forms from the current site that a page or product can show.
export const DETAILS_FORMS: Record<DetailsFormId, DetailsFormSpec> = {
  partner: {
    kind: 'partner',
    title: 'Join the Talasey Network',
    button: 'Send my application',
    sent: "Thanks for applying. We'll review your application and be in touch within 5 working days.",
    sections: [
      {
        heading: 'About you',
        fields: [
          name,
          {
            name: 'business',
            label: 'Business name',
            required: true,
            autoComplete: 'organization',
          },
          email,
          {
            name: 'phone',
            label: 'Mobile number',
            type: 'tel',
            required: true,
            autoComplete: 'tel',
          },
          { name: 'landline', label: 'Landline (optional)', type: 'tel' },
        ],
      },
      { heading: 'Business address', fields: address },
      {
        heading: 'Your business',
        fields: [
          { name: 'merchant', label: 'Main merchant', required: true },
          { name: 'website', label: 'Website (optional)', type: 'url' },
          { name: 'facebook', label: 'Facebook page (optional)', type: 'url' },
          { name: 'instagram', label: 'Instagram (optional)' },
          message('Tell us about your work (optional)'),
        ],
      },
    ],
  },
  warranty: {
    kind: 'warranty',
    title: 'Register your warranty',
    button: 'Register my warranty',
    sent: "Your warranty is registered. We've emailed you a copy to keep with your proof of purchase.",
    sections: [
      {
        heading: 'Owner details',
        fields: [
          name,
          email,
          { name: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
          ...address,
        ],
      },
      {
        heading: 'Purchase information',
        fields: [
          { name: 'product', label: 'Product', required: true },
          { name: 'purchasedOn', label: 'Date of purchase', type: 'date', required: true },
          { name: 'purchasedFrom', label: 'Where you bought it', required: true },
          { name: 'invoice', label: 'Invoice or order number (optional)' },
        ],
      },
      {
        heading: 'Installation information',
        fields: [
          { name: 'installer', label: 'Installed by (optional)' },
          { name: 'installedOn', label: 'Date of installation (optional)', type: 'date' },
          message('Anything else? (optional)'),
        ],
      },
    ],
  },
  contact: messageForm,
  product: { ...messageForm, title: 'Send us a message about this product' },
};

export const detailsFields = (spec: DetailsFormSpec) =>
  spec.sections.flatMap((section) => section.fields);
