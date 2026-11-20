import { z } from 'zod';
import { mainlandPostcodeProblem } from '@/lib/postcodes';

export type LocalHelpKind = 'stockist' | 'installer' | 'showroom';

export const LOCAL_HELP: Record<
  LocalHelpKind,
  { path: string; title: string; intro: string; button: string; sent: string }
> = {
  stockist: {
    path: '/find-a-stockist/',
    title: 'Find a stockist',
    intro:
      "Tell us where you are and what you're looking for, and we'll email you the stockists nearest to you.",
    button: 'Find my nearest stockists',
    sent: "Thank you. We'll email you the stockists nearest to you within one working day.",
  },
  installer: {
    path: '/find-an-installer/',
    title: 'Find an installer',
    intro:
      "Tell us about your project and where it is, and we'll put you in touch with an approved installer near you.",
    button: 'Find me an installer',
    sent: "Thank you. We'll put you in touch with an approved installer within 2 working days.",
  },
  showroom: {
    path: '/book-a-showroom-visit/',
    title: 'Book a showroom visit',
    intro:
      "See and touch our products before you buy. Tell us when you'd like to come and we'll confirm the visit.",
    button: 'Request a visit',
    sent: "Thank you. We'll check availability and confirm your visit within one working day.",
  },
};

export const VISIT_TIMES = ['Morning', 'Afternoon', 'Any time'] as const;

export const localHelpSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  phone: z.string().trim().min(6, 'Enter a phone number we can call you on'),
  email: z.email('Enter an email address like name@example.com'),
  postcode: z.string().superRefine((value, ctx) => {
    const problem = mainlandPostcodeProblem(value);
    if (problem) ctx.addIssue({ code: 'custom', message: problem });
  }),
  visitDate: z.string().trim().optional(),
  visitTime: z.string().trim().optional(),
  projectSize: z.string().trim().max(40).optional(),
  products: z.string().trim().max(200).optional(),
  message: z.string().trim().max(3000, 'Keep it under 3,000 characters').optional(),
});

export const LOCAL_HELP_FIELDS = Object.keys(localHelpSchema.shape);
