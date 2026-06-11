import { z } from 'zod';

/**
 * Qualification options presented in the form dropdown.
 */
export const QUALIFICATIONS = [
  'High School',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Other',
];

/**
 * Zod schema for the user profile form.
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  qualification: z
    .string()
    .min(1, 'Please select your highest qualification')
    .refine((val) => QUALIFICATIONS.includes(val), {
      message: 'Please select a valid qualification',
    }),

  experience: z
    .number({ invalid_type_error: 'Please enter a number' })
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(60, 'Experience seems unrealistically high'),

  profession: z
    .string()
    .trim()
    .min(2, 'Profession must be at least 2 characters')
    .max(150, 'Profession must be under 150 characters'),

  careerGoal: z
    .string()
    .trim()
    .min(10, 'Please describe your career goal in at least 10 characters')
    .max(500, 'Career goal must be under 500 characters'),
});
