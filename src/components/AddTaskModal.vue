<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { taskSchema, type TaskFormValues } from '@/schemas/taskSchema';
import { TaskStatus } from '@/types';

const emit = defineEmits(['close', 'submit']);

const { handleSubmit, resetForm } = useForm<TaskFormValues>({
  validationSchema: toTypedSchema(taskSchema),
  initialValues: {
    title: '',
    description: '',
    assignee: '',
    status: TaskStatus.todo,
    dueDate: '',
  },
});

const { value: title, errorMessage: titleError } = useField<string>('title');
const { value: description, errorMessage: descriptionError } = useField<string>('description');
const { value: assignee, errorMessage: assigneeError } = useField<string>('assignee');
const { value: status, errorMessage: statusError } = useField<TaskStatus>('status');
const { value: dueDate, errorMessage: dueDateError } = useField<string>('dueDate');

const onSubmit = handleSubmit((values) => {
  emit('submit', values);
  resetForm();
});
</script>

<template>
  <div
    class="modal-overlay"
    @click.self="emit('close')"
  >
    <div class="modal-content">
      <h2>Add Task</h2>

      <form @submit="onSubmit">
        <div>
          <input
            v-model="title"
            placeholder="Task Title"
          />
          <span
            v-if="titleError"
            class="error"
            >{{ titleError }}</span
          >
        </div>

        <div>
          <textarea
            v-model="description"
            placeholder="Description (optional)"
          />
          <span
            v-if="descriptionError"
            class="error"
            >{{ descriptionError }}</span
          >
        </div>

        <div>
          <input
            v-model="assignee"
            placeholder="Assignee (optional)"
          />
          <span
            v-if="assigneeError"
            class="error"
            >{{ assigneeError }}</span
          >
        </div>

        <div>
          <select v-model="status">
            <option :value="TaskStatus.todo">To Do</option>
            <option :value="TaskStatus.in_progress">In Progress</option>
            <option :value="TaskStatus.done">Done</option>
          </select>
          <span
            v-if="statusError"
            class="error"
            >{{ statusError }}</span
          >
        </div>

        <div>
          <input
            v-model="dueDate"
            type="date"
          />
          <span
            v-if="dueDateError"
            class="error"
            >{{ dueDateError }}</span
          >
        </div>

        <button type="submit">Create</button>
        <button
          type="button"
          @click="emit('close')"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.8rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
