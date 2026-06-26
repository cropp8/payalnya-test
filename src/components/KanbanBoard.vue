<script setup lang="ts">
import { computed } from 'vue';
import draggable from 'vuedraggable-es';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Draggable = draggable as any;

import { useTaskStore } from '@/stores/tasks';
import { TaskStatus } from '@/types';
import { TASK_STATUS_LABELS } from '@/constants/statusLabels';
import type { Task } from '@/types';

const taskStore = useTaskStore();

const COLUMNS: TaskStatus[] = [TaskStatus.todo, TaskStatus.in_progress, TaskStatus.done];

const getColumnTasks = (status: TaskStatus) =>
  computed({
    get: () => taskStore.tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order),
    set: (reordered: Task[]) => {
      reordered.forEach((task, index) => {
        if (task.status !== status || task.order !== index) {
          taskStore.updateTask(task.id, { status, order: index });
        }
      });
    },
  });

const todoTasks = getColumnTasks(TaskStatus.todo);
const inProgressTasks = getColumnTasks(TaskStatus.in_progress);
const doneTasks = getColumnTasks(TaskStatus.done);

const columnModels = {
  [TaskStatus.todo]: todoTasks,
  [TaskStatus.in_progress]: inProgressTasks,
  [TaskStatus.done]: doneTasks,
};
</script>

<template>
  <div class="ptt-kanban">
    <div
      v-for="status in COLUMNS"
      :key="status"
      class="ptt-kanban__column"
    >
      <h3 class="ptt-heading ptt-kanban__column-title">{{ TASK_STATUS_LABELS[status] }}</h3>

      <Draggable
        v-model="columnModels[status].value"
        group="tasks"
        item-key="id"
        class="ptt-kanban__list"
      >
        <template #item="{ element: task }">
          <div class="ptt-kanban__card">
            <RouterLink
              class="ptt-link"
              :to="{ name: 'task', params: { id: task.id } }"
            >
              {{ task.title }}
            </RouterLink>
            <span
              v-if="task.assignee"
              class="ptt-kanban__assignee"
              >{{ task.assignee }}</span
            >
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>
