<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '@/stores/projects';
import { PROJECT_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import AppTable from '@/components/AppTable.vue';
import type { Project, TableColumn, ProjectStatus } from '@/types';

const projectStore = useProjectStore();
const { projects, isLoading } = storeToRefs(projectStore);

const searchQuery = ref('');
const filterStatus = ref<ProjectStatus | ''>('');

const filteredProjects = computed(() =>
  projects.value.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !filterStatus.value || project.status === filterStatus.value;

    return matchesSearch && matchesStatus;
  }),
);

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
    <h1 class="ptt-heading ptt-mb">Projects</h1>

    <div class="ptt-controls ptt-mb">
      <input
        v-model="searchQuery"
        class="ptt-input"
        placeholder="Search by name..."
        type="text"
      />

      <select v-model="filterStatus" class="ptt-select">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>

      <button class="ptt-button ptt-button--secondary" @click="resetFilters">Reset</button>
    </div>

    <AppTable
      :items="filteredProjects"
      :columns="columns"
      :is-loading="isLoading"
    />
  </div>
</template>
