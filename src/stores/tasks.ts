import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

import { apiServices } from '@/api/services';
import type { Task } from '@/types';
import { handleStoreError } from '@/utils/errorHelper';
import { useProjectStore } from './projects';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);

  const toast = useToast();
  const projectStore = useProjectStore();

  const fetchTasks = async (projectId: number) => {
    isLoading.value = true;

    try {
      tasks.value = await apiServices.tasks.getByProject(projectId);
    } catch (error) {
      handleStoreError(error, 'Error loading tasks.', toast);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTask = async (taskId: number) => {
    isLoading.value = true;

    try {
      const task = await apiServices.tasks.getById(taskId);
      const index = tasks.value.findIndex((t) => t.id === taskId);

      if (index !== -1) {
        tasks.value[index] = task;
      } else {
        tasks.value.push(task);
      }

      return task;
    } catch (error) {
      handleStoreError(error, 'Error loading task.', toast);
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await apiServices.tasks.create(taskData);

      tasks.value.push(newTask);
      projectStore.incrementTaskCount(newTask.projectId);
      toast.success('Task created successfully.');

      return newTask;
    } catch (error) {
      handleStoreError(error, 'Error creating task.', toast);

      throw error;
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    const index = tasks.value.findIndex((task) => task.id === id);

    if (index === -1) {
      return;
    }

    const currentTask = tasks.value[index] as Task;
    const previousTask = { ...currentTask };

    tasks.value[index] = { ...currentTask, ...taskData };

    try {
      await apiServices.tasks.update(taskData, id);
    } catch (error) {
      tasks.value[index] = previousTask;

      handleStoreError(error, 'Task update error.', toast);

      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    const taskToDelete = tasks.value.find((task) => task.id === id);

    if (!taskToDelete) {
      return;
    }

    const previousTasks = [...tasks.value];

    tasks.value = tasks.value.filter((task) => task.id !== id);

    try {
      await apiServices.tasks.delete(id);

      projectStore.decrementTaskCount(taskToDelete.projectId);

      toast.success('Task deleted successfully.');
    } catch (error) {
      tasks.value = previousTasks;
      handleStoreError(error, 'Error deleting task.', toast);

      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
  };
});
