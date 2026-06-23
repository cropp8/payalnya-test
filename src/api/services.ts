import { apiClient } from './client';
import type { Project, Task } from '@/types';

// @TODO: replace any
async function get<T>(url: string, params?: any): Promise<T> {
  try {
    const response = await apiClient.get<T>(url, { params });

    return response.data;
  } catch (error) {
    console.error(`[API Error] GET ${url}:`, error);

    throw error;
  }
}

export const apiServices = {
  projects: {
    getAll: () => get<Project[]>('/projects'),
    create: (data: Partial<Project>) => apiClient.post<Project>('/projects', data),
    // @TODO: update, delete
  },
  tasks: {
    getByProject: (projectId: number) => get<Task[]>('/tasks', { projectId }),
    // @TODO: create, update, delete
  },
};
