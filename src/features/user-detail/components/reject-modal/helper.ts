import { z } from 'zod';

export const RejectSchema = z.object({
  comment: z.string().min(1, 'This field is required')
});
