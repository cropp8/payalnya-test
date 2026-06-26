<script setup lang="ts" generic="T extends { id: number; name: string; status: string }">
import { ref, computed } from 'vue';

import { useTableSort } from '@/composables/useTableSort';
import { useTableFilter } from '@/composables/useTableFilter';
import { useResizable } from '@/composables/useResizable';
import type { ProjectStatus, TableColumn } from '@/types';

const props = defineProps<{
  items: T[];
  columns: TableColumn<T>[];
  isLoading: boolean;
}>();

const searchQuery = ref('');
const filterStatus = ref<ProjectStatus | ''>('');

const itemsRef = computed(() => props.items);
const { filteredData } = useTableFilter(itemsRef, searchQuery, filterStatus);
const { sortedData, sortKey, sortOrder, setSort } = useTableSort<T>(filteredData);

const resetFilters = () => {
  searchQuery.value = '';
  filterStatus.value = '';
};

const tableRef = ref<HTMLTableElement>();
useResizable(tableRef);

const sortOrderIndicator = computed(() => (sortOrder.value === 'asc' ? '↑' : '↓'));
</script>

<template>
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

  <div v-if="isLoading">Loading...</div>

  <table
    v-else
    ref="tableRef"
    class="ptt-table"
    id="resizable"
  >
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="String(col.key)"
          :width="col.width"
          @click="setSort(col.key)"
        >
          {{ col.label }}
          <span v-if="sortKey === col.key">{{ sortOrderIndicator }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in sortedData"
        :key="item.id"
      >
        <td
          v-for="col in columns"
          :key="String(col.key)"
        >
          {{ col.format ? col.format(item[col.key]) : item[col.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
