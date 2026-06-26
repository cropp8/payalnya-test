<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '@/stores/projects';
import { ProjectStatus, type Project } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import { PROJECT_STATUS_LABELS } from '@/constants/statusLabels';
import { useTableSort } from '@/composables/useTableSort';
import { useTableFilter } from '@/composables/useTableFilter';
import { useResizable } from '@/composables/useResizable';

const projectStore = useProjectStore();

const { projects, isLoading } = storeToRefs(projectStore);
const searchQuery = ref('');
const filterStatus = ref<ProjectStatus | ''>('');

const { filteredData } = useTableFilter(projects, searchQuery, filterStatus);

const { sortedData, sortKey, sortOrder, setSort } = useTableSort<Project>(filteredData);

const resetFilters = () => {
  searchQuery.value = '';
  filterStatus.value = '';
};

const projectsTableRef = ref<HTMLTableElement>();
useResizable(projectsTableRef);

onMounted(async () => {
  await projectStore.fetchProjects();
});

const sortOrderIndicator = computed(() => (sortOrder.value === 'asc' ? '↑' : '↓'));
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
        <option :value="ProjectStatus.active">Active</option>
        <option :value="ProjectStatus.archived">Archived</option>
      </select>

      <button @click="resetFilters">Reset</button>
    </div>

    <div v-if="isLoading">Loading projects...</div>

    <table
      v-else
      ref="projectsTableRef"
      class="ptt-table"
      id="resizable"
    >
      <thead>
        <tr>
          <th
            width="250"
            @click="setSort('name')"
          >
            Name <span v-if="sortKey === 'name'">{{ sortOrderIndicator }}</span>
          </th>
          <th
            width="150"
            @click="setSort('status')"
          >
            Status <span v-if="sortKey === 'status'">{{ sortOrderIndicator }}</span>
          </th>
          <th
            width="150"
            @click="setSort('createdAt')"
          >
            Created <span v-if="sortKey === 'createdAt'">{{ sortOrderIndicator }}</span>
          </th>
          <th @click="setSort('taskCount')">
            Tasks <span v-if="sortKey === 'taskCount'">{{ sortOrderIndicator }}</span>
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
