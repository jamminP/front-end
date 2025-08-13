import { z } from 'zod';

export const CtaSchema = z.object({
  label: z.string().min(1),
  to: z.string().min(1),
});

export const SlideSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  imageAlt: z.string().min(1),
  cta: CtaSchema,
});

export const SlidesSchema = z.array(SlideSchema).length(3);

export type Slide = z.infer<typeof SlideSchema>;
