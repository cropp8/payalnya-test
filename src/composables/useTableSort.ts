import { ref, computed, type Ref } from 'vue';

export function useTableSort<T>(data: Ref<T[]>) {
  const sortKey = ref<keyof T | null>(null);
  const sortOrder = ref<'asc' | 'desc'>('asc');

  const sortedData = computed(() => {
    if (!sortKey.value) return data.value;

    return [...data.value].sort((a, b) => {
      const valA = a[sortKey.value as keyof T];
      const valB = b[sortKey.value as keyof T];

      if (valA === valB) {
        return 0;
      }

      if (valA === null || valA === undefined) {
        return sortOrder.value === 'asc' ? 1 : -1;
      }

      if (valB === null || valB === undefined) {
        return sortOrder.value === 'asc' ? -1 : 1;
      }

      let comparison = 0;

      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  });

  const setSort = (key: keyof T) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  };

  return {
    sortKey,
    sortOrder,
    setSort,
    sortedData,
  };
}
