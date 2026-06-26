import axios from 'axios';
import { apiClient } from './client';
import type { Project, Task } from '@/types';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function get<T, P = Record<string, unknown>>(url: string, params?: P): Promise<T> {
  try {
    const response = await apiClient.get<T>(url, { params });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function post<T, D = unknown>(url: string, data: D): Promise<T> {
  try {
    const response = await apiClient.post<T>(url, data);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function put<T, D = unknown>(url: string, data: D): Promise<T> {
  try {
    const response = await apiClient.put<T>(url, data);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function del<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.delete<T>(url);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.error || error.response?.data?.message;
    const message = serverMessage || error.message || 'Error while connecting to the server.';

    console.error(`[API Error ${status}]:`, message);
    throw new ApiError(message, status, error.response?.data);
  }

  if (error instanceof Error) {
    console.error('[App Error]:', error.message);
    throw new ApiError(error.message);
  }

  console.error('[Unknown Error]:', error);
  throw new ApiError('Unknown application error.');
}

export const apiServices = {
  projects: {
    getAll: () => get<Project[]>('/projects'),

    create: (data: Partial<Project>) => post<Project, Partial<Project>>('/projects', data),

    update: (data: Partial<Project>, projectId: number) =>
      put<Project, Partial<Project>>(`/projects/${projectId}`, data),

    delete: (projectId: number) => del<Project>(`/projects/${projectId}`),
  },

  tasks: {
    getByProject: (projectId: number) =>
      get<Task[], { projectId: number }>('/tasks', { projectId }),

    getById: (taskId: number) => get<Task>(`/tasks/${taskId}`),

    create: (data: Partial<Task>) => post<Task, Partial<Task>>('/tasks', data),

    update: (data: Partial<Task>, taskId: number) =>
      put<Task, Partial<Task>>(`/tasks/${taskId}`, data),

    delete: (taskId: number) => del<Task>(`/tasks/${taskId}`),
  },
};
