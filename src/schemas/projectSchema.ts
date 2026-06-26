import { z } from 'zod';
import { ProjectStatus } from '@/types';

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be 3 characters or more.')
    .max(50, 'Name must be under 50 characters.'),
  status: z.nativeEnum(ProjectStatus, {
    errorMap: () => ({ message: 'Choose correct status.' }),
  }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
