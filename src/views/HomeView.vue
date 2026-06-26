<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '@/stores/projects';
import type { Project } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import { PROJECT_STATUS_LABELS } from '@/constants/statusLabels';
import { useTableSort } from '@/composables/useTableSort';

const projectStore = useProjectStore();

const { projects, isLoading } = storeToRefs(projectStore);
const { sortedData, sortKey, sortOrder, setSort } = useTableSort<Project>(projects);

onMounted(async () => {
  await projectStore.fetchProjects();
});
</script>

<template>
  <div>
    <h1 class="ptt-heading">Projects</h1>

    <div v-if="isLoading">Loading projects...</div>

    <table
      v-else
      class="ptt-table"
    >
      <thead>
        <tr>
          <th @click="setSort('name')">
            Name <span v-if="sortKey === 'name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="setSort('status')">
            Status <span v-if="sortKey === 'status'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="setSort('createdAt')">
            Created
            <span v-if="sortKey === 'createdAt'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="setSort('taskCount')">
            Tasks <span v-if="sortKey === 'taskCount'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in sortedData"
          :key="project.id"
        >
          <td>{{ project.name }}</td>
          <td>{{ PROJECT_STATUS_LABELS[project.status] }}</td>
          <td>{{ formatDate(project.createdAt) }}</td>
          <td>{{ project.taskCount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
