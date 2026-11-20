import { z } from 'zod';

const text = z.string().trim().min(1);
const optional = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);

const link = z.object({ label: text, href: text });
const photo = z.object({
  src: text,
  alt: z.string().default(''),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const section = z.object({
  label: text,
  href: optional,
  photo: photo.nullish(),
  links: z.array(link).default([]),
});

// "Navigation" in /content: the main menu, the links at the very top and the footer columns.
export const navigationSchema = z.object({
  menu: z
    .array(z.object({ label: text, href: optional, sections: z.array(section).default([]) }))
    .min(1),
  header: z.array(link).default([]),
  footer: z.array(z.object({ heading: text, links: z.array(link).min(1) })).default([]),
});

export type Navigation = z.infer<typeof navigationSchema>;
export type MenuItem = Navigation['menu'][number];
export type MenuSection = z.infer<typeof section>;
export type NavLink = z.infer<typeof link>;

const siteSettingsSchema = z.object({
  contactPhone: text,
  contactEmail: optional,
  openingHours: optional,
  address: optional,
  socialProfiles: z.array(z.string()).default([]),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const parseNavigation = (data: unknown) => navigationSchema.safeParse(data);
export const parseSiteSettings = (data: unknown) => siteSettingsSchema.safeParse(data);
