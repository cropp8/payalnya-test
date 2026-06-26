import { ProjectStatus, TaskStatus } from '@/types';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.active]: 'Active',
  [ProjectStatus.archived]: 'Archived',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.todo]: 'To Do',
  [TaskStatus.in_progress]: 'In Progress',
  [TaskStatus.done]: 'Done',
};
