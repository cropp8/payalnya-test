<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/projects';

const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore);
</script>

<template>
  <h3 class="ptt-heading ptt-mb">Projects</h3>

  <nav>
    <ul class="ptt-list ptt-mb">
      <li
        v-for="project in projects"
        :key="project.id"
      >
        <RouterLink
          :to="{ name: 'project', params: { id: project.id } }"
          class="ptt-link"
        >
          {{ project.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
