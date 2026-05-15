import { z } from 'zod'

const heroMetricSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
})

export const personalInfoSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  headline: z.string().min(5, 'Headline must be at least 5 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  email: z.string().email('Valid email required'),
  location: z.string().optional().or(z.literal('')),
  linkedin_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  github_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  availability_status: z
    .string()
    .max(60, 'Max 60 characters')
    .optional()
    .or(z.literal('')),
  hero_metrics: z
    .array(heroMetricSchema)
    .max(6, 'Maximum 6 metrics allowed'),
})

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>

const quickFactSchema = z.object({
  label: z.string().min(1, 'Label is required').max(80, 'Max 80 characters'),
  value: z.string().min(1, 'Value is required').max(200, 'Max 200 characters'),
})

export const aboutSchema = z.object({
  content: z.string().max(50000, 'Max 50,000 characters'),
  quick_facts: z.array(quickFactSchema).max(8, 'Maximum 8 facts allowed'),
})

export type AboutInput = z.infer<typeof aboutSchema>
