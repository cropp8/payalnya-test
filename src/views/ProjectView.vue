<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTaskStore } from '@/stores/tasks';
import { TASK_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import AppTable from '@/components/AppTable.vue';
import AddTaskModal from '@/components/AddTaskModal.vue';
import type { Task, TableColumn } from '@/types';
import type { TaskFormValues } from '@/schemas/taskSchema';

const VIEW_MODE_KEY = 'project-view-mode';
type ViewMode = 'table' | 'kanban';

const route = useRoute();
const projectId = Number(route.params.id);

const taskStore = useTaskStore();
const { tasks, isLoading } = storeToRefs(taskStore);

const viewMode = ref<ViewMode>((localStorage.getItem(VIEW_MODE_KEY) as ViewMode) ?? 'table');
const isModalOpen = ref(false);

const setViewMode = (mode: ViewMode) => {
  viewMode.value = mode;
  localStorage.setItem(VIEW_MODE_KEY, mode);
  console.log(mode === 'kanban' ? 'Kanban' : 'Table');
};

const handleAddTask = async (values: TaskFormValues) => {
  try {
    await taskStore.createTask({
      ...values,
      description: values.description ?? null,
      assignee: values.assignee || null,
      projectId,
    });
    isModalOpen.value = false;
  } catch (_) {}
};

onMounted(async () => {
  await taskStore.fetchTasks(projectId);
});

const columns: TableColumn<Task>[] = [
  { key: 'id', label: 'ID', width: 80 },
  { key: 'title', label: 'Title', width: 250, routeTo: (item) => ({ name: 'task', params: { id: item.id } }) },
  { key: 'assignee', label: 'Assignee', width: 150, format: (v) => (v as string | null) ?? '—' },
  { key: 'status', label: 'Status', width: 150, format: (v) => TASK_STATUS_LABELS[v as keyof typeof TASK_STATUS_LABELS] },
  { key: 'dueDate', label: 'Due Date', width: 150, format: (v) => formatDate(v as string) },
];
</script>

<template>
  <div>
    <h1 class="ptt-heading">Project name</h1>

    <div class="ptt-view-toggle">
      <button
        :class="{ active: viewMode === 'table' }"
        @click="setViewMode('table')"
      >
        Table
      </button>
      <button
        :class="{ active: viewMode === 'kanban' }"
        @click="setViewMode('kanban')"
      >
        Kanban
      </button>
    </div>

    <button @click="isModalOpen = true">Add Task</button>

    <AppTable
      :items="tasks"
      :columns="columns"
      :is-loading="isLoading"
    />

    <AddTaskModal
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleAddTask"
    />
  </div>
</template>
