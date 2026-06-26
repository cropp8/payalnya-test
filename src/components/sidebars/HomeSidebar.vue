<script setup lang="ts">
import { ref } from 'vue';

import { useProjectStore } from '@/stores/projects';
import ProjectModal from '@/components/ProjectModal.vue';
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
  <button class="ptt-button" @click="isModalOpen = true">Add Project</button>

  <ProjectModal
    v-if="isModalOpen"
    @close="isModalOpen = false"
    @submit="handleAddProject"
  />
</template>
