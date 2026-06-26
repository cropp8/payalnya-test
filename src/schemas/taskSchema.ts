import { z } from 'zod';
import { TaskStatus } from '@/types';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be 3 characters or more.')
    .max(120, 'Title must be under 120 characters.'),
  description: z.string().max(500, 'Description must be under 500 characters.').optional(),
  assignee: z.string().max(50, 'Assignee must be under 50 characters.').optional(),
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: 'Choose correct status.' }),
  }),
  dueDate: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), { message: 'Invalid date.' })
    .refine((val) => new Date(val) >= today, { message: 'Due date cannot be in the past.' }),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
