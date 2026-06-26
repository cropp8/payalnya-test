import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

import { apiServices } from '@/api/services';
import type { Project } from '@/types';
import { handleStoreError } from '@/utils/errorHelper';
import type { ProjectFormValues } from '@/schemas/projectSchema';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const isLoading = ref(false);

  const toast = useToast();

  const fetchProjects = async () => {
    isLoading.value = true;

    try {
      projects.value = await apiServices.projects.getAll();
    } catch (error) {
      handleStoreError(error, 'Error loading projects.', toast);
    } finally {
      isLoading.value = false;
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = await apiServices.projects.create(projectData);

      projects.value.push(newProject);
      toast.success('Project created successfully.');

      return newProject;
    } catch (error) {
      handleStoreError(error, 'Error creating project.', toast);

      throw error;
    }
  };

  const updateProject = async (id: number, projectData: Partial<Project>) => {
    try {
      const updatedProject = await apiServices.projects.update(projectData, id);
      const index = projects.value.findIndex((project) => project.id === id);

      if (index !== -1) {
        projects.value[index] = updatedProject;
      }

      toast.success('Project updated successfully.');
    } catch (error) {
      handleStoreError(error, 'Project update error.', toast);

      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await apiServices.projects.delete(id);

      projects.value = projects.value.filter((project) => project.id !== id);
      toast.success('Project deleted successfully');
    } catch (error) {
      handleStoreError(error, 'Error deleting project.', toast);

      throw error;
    }
  };

  const incrementTaskCount = (projectId: number) => {
    const currentProject = projects.value.find((project) => project.id === projectId);

    if (currentProject) {
      currentProject.taskCount = (currentProject.taskCount || 0) + 1;
    }
  };

  const decrementTaskCount = (projectId: number) => {
    const currentProject = projects.value.find((project) => project.id === projectId);

    if (currentProject?.taskCount && currentProject?.taskCount > 0) {
      currentProject.taskCount -= 1;
    }
  };

  const addProject = async (payload: ProjectFormValues) => {
    const newProject: Partial<Project> = {
      ...payload,
      createdAt: new Date().toISOString(),
      taskCount: 0,
    };

    await createProject(newProject);
  };

  return {
    projects,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    incrementTaskCount,
    decrementTaskCount,
    addProject,
  };
});
