type ISODateString = string;

export enum ProjectStatus {
  active = 'active',
  archived = 'archived',
}

export enum TaskStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  done = 'done',
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  taskCount: number;
  status: ProjectStatus;
  createdAt: ISODateString;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  assignee: string | null;
  status: TaskStatus;
  dueDate: ISODateString;
}
