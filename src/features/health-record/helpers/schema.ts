/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

export enum BasicHealthRecordKey {
  Country = 'country',
  DOB = 'dayOfBirth',
  DiagnosedDisease = 'diagnosedDisease',
  Sex = 'sex',
  Title = 'title'
}

export const BasicHealthRecordSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  sex: z.string({ required_error: 'This field is required' }),
  country: z.string({ required_error: 'This field is required' }),
  dayOfBirth: z
    .date({ required_error: 'This field is required' })
    .max(new Date(), 'This is not valid date')
    .refine((val): val is Date => val !== null, {
      message: 'This is not valid date'
    }),
  diagnosedDisease: z.string().optional()
});
