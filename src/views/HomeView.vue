<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '@/stores/projects';
import { PROJECT_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import { useTableFilter } from '@/composables/useTableFilter';
import AppTable from '@/components/AppTable.vue';
import type { Project, TableColumn, ProjectStatus } from '@/types';

const projectStore = useProjectStore();
const { projects, isLoading } = storeToRefs(projectStore);

const searchQuery = ref('');
const filterStatus = ref<ProjectStatus | ''>('');
const { filteredData } = useTableFilter(projects, searchQuery, filterStatus);

const resetFilters = () => {
  searchQuery.value = '';
  filterStatus.value = '';
};

onMounted(async () => {
  await projectStore.fetchProjects();
});

const columns: TableColumn<Project>[] = [
  { key: 'name', label: 'Name', width: 250, routeTo: (item) => ({ name: 'project', params: { id: item.id } }) },
  { key: 'status', label: 'Status', width: 150, format: (v) => PROJECT_STATUS_LABELS[v as keyof typeof PROJECT_STATUS_LABELS] },
  { key: 'createdAt', label: 'Created', width: 150, format: (v) => formatDate(v as string) },
  { key: 'taskCount', label: 'Tasks' },
];
</script>

<template>
  <div>
    <h1 class="ptt-heading">Projects</h1>

    <div class="ptt-controls">
      <input
        v-model="searchQuery"
        placeholder="Search by name..."
        type="text"
      />

      <select v-model="filterStatus">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>

      <button @click="resetFilters">Reset</button>
    </div>

    <AppTable
      :items="filteredData"
      :columns="columns"
      :is-loading="isLoading"
    />
  </div>
</template>
