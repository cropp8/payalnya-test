import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router';

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
  description: string | null;
  assignee: string | null;
  status: TaskStatus;
  dueDate: ISODateString;
  order: number;
}

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  width?: number;
  sortable?: boolean;
  format?: (value: T[keyof T]) => string;
  routeTo?: (item: T) => RouteLocationRaw;
};

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: (route: RouteLocationNormalizedLoaded) => string;
    parent?: (route: RouteLocationNormalizedLoaded) => { name: string; params?: Record<string, string | number> } | null;
  }
}
