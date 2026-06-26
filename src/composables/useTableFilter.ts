import { computed, type Ref } from 'vue';

import { type ProjectStatus } from '@/types';

export const useTableFilter = <T extends { name: string; status: string }>(
  data: Ref<T[]>,
  searchQuery: Ref<string>,
  filterStatus: Ref<ProjectStatus | ''>,
) => {
  const filteredData = computed(() => {
    return data.value.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());

      const matchesStatus = filterStatus.value === '' || item.status === filterStatus.value;

      return matchesSearch && matchesStatus;
    });
  });

  return { filteredData };
};
