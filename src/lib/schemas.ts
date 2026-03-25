import { z } from 'zod';

export const onboardingSchema = z.object({
  age: z.string().min(1, 'Age is required'),
  gender: z.string().min(1, 'Gender is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  phase: z.enum(['HPOP', 'TPOP', 'EPOP']),
  health_history: z.string().optional(),
  goals: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
