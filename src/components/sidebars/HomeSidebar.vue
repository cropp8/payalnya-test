<script setup lang="ts">
import { ref } from 'vue';

import { useProjectStore } from '@/stores/projects';
import AddProjectModal from '@/components/AddProjectModal.vue';
import type { ProjectFormValues } from '@/schemas/projectSchema';

const projectStore = useProjectStore();

const isModalOpen = ref(false);

const handleAddProject = async (values: ProjectFormValues) => {
  try {
    await projectStore.addProject(values);

    isModalOpen.value = false;
  } catch (_) {}
};
</script>

<template>
  <button @click="isModalOpen = true">Add Project</button>

  <AddProjectModal
    v-if="isModalOpen"
    @close="isModalOpen = false"
    @submit="handleAddProject"
  />
</template>
