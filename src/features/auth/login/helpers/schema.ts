import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'This is required field'),
  password: z.string().min(1, 'This is required field'),
  remember: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;
