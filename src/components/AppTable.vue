<script setup lang="ts" generic="T extends { id: number }">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

import { useTableSort } from '@/composables/useTableSort';
import { useResizable } from '@/composables/useResizable';
import type { TableColumn } from '@/types';

const props = defineProps<{
  items: T[];
  columns: TableColumn<T>[];
  isLoading: boolean;
}>();

const itemsRef = computed(() => props.items);
const { sortedData, sortKey, sortOrder, setSort } = useTableSort<T>(itemsRef);

const tableRef = ref<HTMLTableElement>();
useResizable(tableRef);

const sortOrderIndicator = computed(() => (sortOrder.value === 'asc' ? '↑' : '↓'));
</script>

<template>
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
          :class="{ 'ptt-table__th--sortable': col.sortable !== false }"
          @click="col.sortable !== false && setSort(col.key)"
        >
          {{ col.label }}
          <span v-if="sortKey === col.key && col.sortable !== false">{{ sortOrderIndicator }}</span>
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
          <RouterLink v-if="col.routeTo" class="ptt-link" :to="col.routeTo(item)">
            {{ col.format ? col.format(item[col.key]) : item[col.key] }}
          </RouterLink>
          <template v-else>
            {{ col.format ? col.format(item[col.key]) : item[col.key] }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
