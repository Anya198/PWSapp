import { z } from 'zod';

export const onboardingSchema = z.object({
  // Step 1 - Welcome / identity
  display_name: z.string().optional(),
  // Step 2 - Physical Baseline
  age: z.string().min(1, 'Age is required'),
  gender: z.string().min(1, 'Gender is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional().default('moderate'),
  // Step 3 - Program Phase
  phase: z.enum(['HPOP', 'TPOP', 'EPOP']),
  // Step 3 - Lifestyle Profile
  sleep_hours: z.string().optional(),
  stress_level: z.enum(['low', 'medium', 'high']).optional(),
  dietary_preference: z.string().optional(),
  // Step 4 - Photo
  profile_photo_url: z.string().optional(),
  // Meta
  goals: z.string().optional(),
  health_history: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
export type OnboardingInputValues = z.input<typeof onboardingSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
