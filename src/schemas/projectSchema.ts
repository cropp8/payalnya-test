import { z } from 'zod';
import { ProjectStatus } from '@/types';

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be 3 characters or more.')
    .max(100, 'Name must be under 100 characters.'),
  description: z.string().max(500, 'Description must be under 500 characters.').optional(),
  status: z.nativeEnum(ProjectStatus, {
    errorMap: () => ({ message: 'Choose correct status.' }),
  }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
