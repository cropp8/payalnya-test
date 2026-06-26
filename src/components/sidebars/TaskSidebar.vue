<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useTaskStore } from '@/stores/tasks';
import { useProjectStore } from '@/stores/projects';
import type { Task } from '@/types';

const route = useRoute();
const taskId = Number(route.params.id);

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const task = ref<Task | null>(null);

onMounted(async () => {
  task.value = (await taskStore.fetchTask(taskId)) ?? null;

  if (task.value && !projectStore.projects.length) {
    await projectStore.fetchProjects();
  }
});

const project = computed(() =>
  task.value ? projectStore.projects.find((p) => p.id === task.value!.projectId) : null,
);
</script>

<template>
  <div v-if="project">
    <h2 class="ptt-heading">{{ project.name }}</h2>
    <p v-if="project.description">{{ project.description }}</p>
  </div>
</template>
