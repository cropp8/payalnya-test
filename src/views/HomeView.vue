<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '@/stores/projects';
import { PROJECT_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import AppTable from '@/components/AppTable.vue';
import type { Project, TableColumn } from '@/types';

const projectStore = useProjectStore();
const { projects, isLoading } = storeToRefs(projectStore);

onMounted(async () => {
  await projectStore.fetchProjects();
});

const columns: TableColumn<Project>[] = [
  { key: 'name', label: 'Name', width: 250 },
  { key: 'status', label: 'Status', width: 150, format: (v) => PROJECT_STATUS_LABELS[v as keyof typeof PROJECT_STATUS_LABELS] },
  { key: 'createdAt', label: 'Created', width: 150, format: (v) => formatDate(v as string) },
  { key: 'taskCount', label: 'Tasks' },
];
</script>

<template>
  <div>
    <h1 class="ptt-heading">Projects</h1>

    <AppTable
      :items="projects"
      :columns="columns"
      :is-loading="isLoading"
    />
  </div>
</template>
