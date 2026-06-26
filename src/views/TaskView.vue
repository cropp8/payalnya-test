<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useTaskStore } from '@/stores/tasks';
import { TASK_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import TaskModal from '@/components/TaskModal.vue';
import type { Task } from '@/types';
import type { TaskFormValues } from '@/schemas/taskSchema';

const route = useRoute();
const taskId = Number(route.params.id);

const taskStore = useTaskStore();
const task = ref<Task | null>(null);
const isLoading = ref(false);
const isModalOpen = ref(false);

onMounted(async () => {
  isLoading.value = true;
  task.value = (await taskStore.fetchTask(taskId)) ?? null;
  isLoading.value = false;
});

const handleEditTask = async (values: TaskFormValues) => {
  try {
    await taskStore.updateTask(taskId, {
      ...values,
      description: values.description ?? null,
      assignee: values.assignee || null,
    });
    task.value = taskStore.tasks.find((t) => t.id === taskId) ?? null;
    isModalOpen.value = false;
  } catch (_) {}
};
</script>

<template>
  <div v-if="isLoading">Loading...</div>

  <div v-else-if="task">
    <div class="ptt-head ptt-mb">
      <h1 class="ptt-heading">{{ task.title }}</h1>
      <button class="ptt-button" @click="isModalOpen = true">Edit Task</button>
    </div>

    <p v-if="task.description" class="ptt-mb">{{ task.description }}</p>

    <table class="ptt-table">
      <tbody>
        <tr>
          <td class="ptt-table__label">Assignee</td>
          <td>{{ task.assignee ?? '-' }}</td>
        </tr>
        <tr>
          <td class="ptt-table__label">Status</td>
          <td>{{ TASK_STATUS_LABELS[task.status] }}</td>
        </tr>
        <tr>
          <td class="ptt-table__label">Due Date</td>
          <td>{{ formatDate(task.dueDate) }}</td>
        </tr>
      </tbody>
    </table>

    <TaskModal
      v-if="isModalOpen"
      :initial-values="{ title: task.title, description: task.description ?? '', assignee: task.assignee ?? '', status: task.status, dueDate: task.dueDate }"
      @close="isModalOpen = false"
      @submit="handleEditTask"
    />
  </div>
</template>
