import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please provide a valid email address').max(160),
  major: z.string().trim().min(1, 'Major or department is required').max(120),
  university: z.string().trim().max(120).optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password is too long'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    university: z.string().trim().min(2).max(120).optional(),
    major: z.string().trim().min(2).max(120).optional(),
    year: z.string().trim().min(1).max(40).optional(),
    statusBanner: z.string().trim().min(1).max(120).optional(),
    gpaGoal: z.string().trim().max(10).optional(),
    gpaCurrent: z.string().trim().max(10).optional(),
    gpaProgress: z.number().min(0).max(100).optional(),
    honorsCount: z.number().int().min(0).max(20).optional(),
    preferences: z
      .object({
        notifications: z.boolean().optional(),
        weeklyDigest: z.boolean().optional(),
        theme: z.enum(['dark', 'light']).optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one profile field or preference must be provided',
  });
