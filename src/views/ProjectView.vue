<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTaskStore } from '@/stores/tasks';
import { useProjectStore } from '@/stores/projects';
import { TASK_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import AppTable from '@/components/AppTable.vue';
import TaskModal from '@/components/TaskModal.vue';
import ProjectModal from '@/components/ProjectModal.vue';
import KanbanBoard from '@/components/KanbanBoard.vue';
import type { Task, TableColumn, TaskStatus } from '@/types';
import type { TaskFormValues } from '@/schemas/taskSchema';
import type { ProjectFormValues } from '@/schemas/projectSchema';

const VIEW_MODE_KEY = 'project-view-mode';
type ViewMode = 'table' | 'kanban';

const route = useRoute();
const projectId = Number(route.params.id);

const taskStore = useTaskStore();
const projectStore = useProjectStore();
const { tasks, isLoading } = storeToRefs(taskStore);

const project = computed(() => projectStore.projects.find((p) => p.id === projectId));

const viewMode = ref<ViewMode>((localStorage.getItem(VIEW_MODE_KEY) as ViewMode) ?? 'table');
const isTaskModalOpen = ref(false);
const isProjectModalOpen = ref(false);
const searchAssignee = ref('');
const filterStatus = ref<TaskStatus | ''>('');

const filteredTasks = computed(() =>
  tasks.value.filter((task) => {
    const matchesAssignee =
      !searchAssignee.value ||
      task.assignee?.toLowerCase().includes(searchAssignee.value.toLowerCase());
    const matchesStatus = !filterStatus.value || task.status === filterStatus.value;

    return matchesAssignee && matchesStatus;
  }),
);

const resetFilters = () => {
  searchAssignee.value = '';
  filterStatus.value = '';
};

const setViewMode = (mode: ViewMode) => {
  viewMode.value = mode;
  localStorage.setItem(VIEW_MODE_KEY, mode);
};

const handleAddTask = async (values: TaskFormValues) => {
  try {
    await taskStore.createTask({
      ...values,
      description: values.description ?? null,
      assignee: values.assignee || null,
      projectId,
    });
    isTaskModalOpen.value = false;
  } catch (_) {}
};

const handleEditProject = async (values: ProjectFormValues) => {
  try {
    await projectStore.updateProject(projectId, values);
    isProjectModalOpen.value = false;
  } catch (_) {}
};

onMounted(async () => {
  await taskStore.fetchTasks(projectId);
});

const columns: TableColumn<Task>[] = [
  { key: 'id', label: 'ID', width: 80, sortable: false },
  {
    key: 'title',
    label: 'Title',
    width: 250,
    sortable: false,
    routeTo: (item) => ({ name: 'task', params: { id: item.id } }),
  },
  {
    key: 'assignee',
    label: 'Assignee',
    width: 150,
    sortable: false,
    format: (v) => (v as string | null) ?? '—',
  },
  {
    key: 'status',
    label: 'Status',
    width: 150,
    format: (v) => TASK_STATUS_LABELS[v as keyof typeof TASK_STATUS_LABELS],
  },
  { key: 'dueDate', label: 'Due Date', width: 150, format: (v) => formatDate(v as string) },
];
</script>

<template>
  <div class="ptt-head ptt-mb">
    <h1 class="ptt-heading">{{ project?.name ?? 'Project' }}</h1>

    <div class="ptt-head__actions">
      <div class="ptt-view-toggle">
        <button
          :class="[
            'ptt-button',
            'ptt-button--secondary',
            { 'ptt-button--active': viewMode === 'table' },
          ]"
          @click="setViewMode('table')"
        >
          Table
        </button>
        <button
          :class="[
            'ptt-button',
            'ptt-button--secondary',
            { 'ptt-button--active': viewMode === 'kanban' },
          ]"
          @click="setViewMode('kanban')"
        >
          Kanban
        </button>
      </div>

      <button
        class="ptt-button"
        @click="isProjectModalOpen = true"
      >
        Edit Project
      </button>
    </div>
  </div>

  <div class="ptt-mb">
    <button
      class="ptt-button"
      @click="isTaskModalOpen = true"
    >
      Add Task
    </button>
  </div>

  <div class="ptt-controls ptt-mb">
    <input
      v-model="searchAssignee"
      class="ptt-input"
      placeholder="Search by assignee..."
      type="text"
    />

    <select
      v-model="filterStatus"
      class="ptt-select"
    >
      <option value="">All Statuses</option>
      <option value="todo">To Do</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>

    <button
      class="ptt-button ptt-button--secondary"
      @click="resetFilters"
    >
      Reset
    </button>
  </div>

  <AppTable
    v-if="viewMode === 'table'"
    :items="filteredTasks"
    :columns="columns"
    :is-loading="isLoading"
  />

  <KanbanBoard v-else />

  <TaskModal
    v-if="isTaskModalOpen"
    @close="isTaskModalOpen = false"
    @submit="handleAddTask"
  />

  <ProjectModal
    v-if="isProjectModalOpen && project"
    :initial-values="{
      name: project.name,
      description: project.description ?? '',
      status: project.status,
    }"
    @close="isProjectModalOpen = false"
    @submit="handleEditProject"
  />
</template>
