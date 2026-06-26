import MockAdapter from 'axios-mock-adapter';

import { apiClient } from './client';
import type { Project, Task } from '@/types';

const projectUrlRegex = /\/projects\/(\d+)/;
const taskUrlRegex = /\/tasks\/(\d+)/;

const mock = new MockAdapter(apiClient, { delayResponse: 200 });

// Project mocks
mock.onGet('/projects').reply(() => {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');

  return [200, projects];
});

mock.onPost('/projects').reply((config) => {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const newProject = JSON.parse(config.data);

  newProject.id = Date.now();
  projects.push(newProject);
  localStorage.setItem('projects', JSON.stringify(projects));

  return [201, newProject];
});

mock.onPut(projectUrlRegex).reply((config) => {
  const match = config.url?.match(projectUrlRegex);
  const id = match ? Number(match[1]) : null;

  if (!id) {
    return [400, { error: 'Invalid ID' }];
  }

  const updateData = JSON.parse(config.data);
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const projectIndex = projects.findIndex((project: Project) => project.id === id);

  if (projectIndex !== -1) {
    projects[projectIndex] = { ...projects[projectIndex], ...updateData };
    localStorage.setItem('projects', JSON.stringify(projects));

    return [200, projects[projectIndex]];
  }

  return [404, { error: 'Project not found' }];
});

mock.onDelete(projectUrlRegex).reply((config) => {
  const match = config.url?.match(projectUrlRegex);
  const id = match ? Number(match[1]) : null;

  if (!id) {
    return [400, { error: 'Invalid ID' }];
  }

  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const filteredProjects = projects.filter((project: Project) => project.id !== id);

  if (projects.length !== filteredProjects.length) {
    localStorage.setItem('projects', JSON.stringify(filteredProjects));

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const tilteredTasks = tasks.filter((task: Task) => task.projectId !== id);
    localStorage.setItem('tasks', JSON.stringify(tilteredTasks));

    return [200, { success: true }];
  }

  return [404, { error: 'Project not found' }];
});

// Task mocks
mock.onGet('/tasks').reply((config) => {
  const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const projectId = config.params?.projectId;

  if (projectId) {
    const filteredTasks = allTasks
      .filter((task: Task) => task.projectId === Number(projectId))
      .sort((a: Task, b: Task) => a.order - b.order);

    return [200, filteredTasks];
  }

  return [200, allTasks.sort((a: Task, b: Task) => a.order - b.order)];
});

mock.onGet(taskUrlRegex).reply((config) => {
  const match = config.url?.match(taskUrlRegex);
  const id = match ? Number(match[1]) : null;

  if (!id) {
    return [400, { error: 'Invalid ID' }];
  }

  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const task = tasks.find((t: Task) => t.id === id);

  return task ? [200, task] : [404, { error: 'Task not found' }];
});

mock.onPost('/tasks').reply((config) => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const newTask = JSON.parse(config.data);

  newTask.id = Date.now();
  newTask.order = tasks.length;

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  return [201, newTask];
});

mock.onPut(taskUrlRegex).reply((config) => {
  const match = config.url?.match(taskUrlRegex);
  const id = match ? Number(match[1]) : null;

  if (!id) {
    return [400, { error: 'Invalid ID' }];
  }

  const updateData = JSON.parse(config.data);
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskIndex = tasks.findIndex((task: Task) => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updateData };
    localStorage.setItem('tasks', JSON.stringify(tasks));

    return [200, tasks[taskIndex]];
  }

  return [404, { error: 'Task not found' }];
});

mock.onDelete(taskUrlRegex).reply((config) => {
  const match = config.url?.match(taskUrlRegex);
  const id = match ? Number(match[1]) : null;

  if (!id) {
    return [400, { error: 'Invalid ID' }];
  }

  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const filteredTasks = tasks.filter((task: Task) => task.id !== id);

  if (tasks.length !== filteredTasks.length) {
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));

    return [200, { success: true }];
  }

  return [404, { error: 'Task not found' }];
});
