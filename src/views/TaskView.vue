<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useTaskStore } from '@/stores/tasks';
import { TASK_STATUS_LABELS } from '@/constants/statusLabels';
import { formatDate } from '@/utils/dateFormatter';
import type { Task } from '@/types';

const route = useRoute();
const taskId = Number(route.params.id);

const taskStore = useTaskStore();
const task = ref<Task | null>(null);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  task.value = (await taskStore.fetchTask(taskId)) ?? null;
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading">Loading...</div>

  <div v-else-if="task">
    <h1 class="ptt-heading">{{ task.title }}</h1>

    <p>{{ task.description ?? '-' }}</p>
    <p>{{ task.assignee ?? '-' }}</p>
    <p>{{ TASK_STATUS_LABELS[task.status] }}</p>
    <p>{{ formatDate(task.dueDate) }}</p>
  </div>
</template>
