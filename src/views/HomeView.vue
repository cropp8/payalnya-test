<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useProjectStore } from '@/stores/projects';
import { type Project } from '@/types';

const projectStore = useProjectStore();

const projects = ref<Project[]>([]);

onMounted(async () => {
  await projectStore.fetchProjects();

  projects.value = projectStore.projects;
});
</script>

<template>
  <div>
    <h1 class="ptt-heading">Projects</h1>
    <table class="ptt-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Created</th>
          <th>Tasks</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
        >
          <td>{{ project.name }}</td>
          <td>{{ project.status }}</td>
          <td>{{ project.createdAt }}</td>
          <td>{{ project.taskCount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
