import { z } from 'zod';
import { mainlandPostcodeProblem } from '@/lib/postcodes';
import { MAX_PHOTO_BYTES, MAX_PHOTOS, PHOTO_TYPES } from './enquiry';

// The questions every site survey request asks. The answers travel as "question: answer".
export const SURVEY_QUESTIONS = [
  {
    name: 'when',
    label: 'When would you like it installed?',
    answers: ['Within 3 months', '3–6 months', '6–12 months', 'Just researching'],
  },
  {
    name: 'ground',
    label: 'Is the ground level?',
    answers: ['Not sure', 'Level', 'Slight slope', 'Steep slope'],
  },
  {
    name: 'access',
    label: 'Narrowest access to the site',
    answers: ['Not sure', 'Under 90 cm', '90 cm–1.5 m', 'Over 1.5 m or vehicle access'],
  },
  { name: 'electrics', label: 'Will you need electrics?', answers: ['Not sure', 'Yes', 'No'] },
  {
    name: 'planning',
    label: 'Is the property listed or in a conservation area?',
    answers: ['Not sure', 'No', 'Yes'],
  },
  {
    name: 'callTime',
    label: 'Best time to call',
    answers: ['Any time', 'Morning', 'Afternoon', 'Evening'],
  },
  {
    name: 'heard',
    label: 'How did you hear about us?',
    answers: ['Search engine', 'Social media', 'Recommendation', 'Showroom or event', 'Other'],
  },
] as const;

export const surveySchema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  phone: z.string().trim().min(6, 'Enter a phone number we can call you on'),
  email: z.email('Enter an email address like name@example.com'),
  postcode: z.string().superRefine((value, ctx) => {
    const problem = mainlandPostcodeProblem(value);
    if (problem) ctx.addIssue({ code: 'custom', message: problem });
  }),
  size: z.string().trim().optional(),
  notes: z.string().trim().max(3000, 'Keep it under 3,000 characters').optional(),
});

export const SURVEY_FIELDS = [
  ...Object.keys(surveySchema.shape),
  ...SURVEY_QUESTIONS.map((question) => question.name),
];

export function photosProblem(files: File[]): string | null {
  if (files.length > MAX_PHOTOS) return `Send up to ${MAX_PHOTOS} photos`;
  if (files.some((file) => file.type && !PHOTO_TYPES.includes(file.type))) {
    return 'Send photos as JPEG, PNG, WebP or HEIC';
  }
  if (files.some((file) => file.size > MAX_PHOTO_BYTES)) return 'Each photo must be under 5 MB';
  return null;
}
