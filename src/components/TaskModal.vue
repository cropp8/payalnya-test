<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { taskSchema, type TaskFormValues } from '@/schemas/taskSchema';
import { TaskStatus } from '@/types';

const props = defineProps<{
  initialValues?: TaskFormValues;
}>();

const emit = defineEmits(['close', 'submit']);

const isEditing = !!props.initialValues;

const { handleSubmit, resetForm } = useForm<TaskFormValues>({
  validationSchema: toTypedSchema(taskSchema),
  initialValues: props.initialValues ?? {
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
    class="ptt-modal__overlay"
    @click.self="emit('close')"
  >
    <div class="ptt-modal__content">
      <h2 class="ptt-heading ptt-modal__title ptt-mb">{{ isEditing ? 'Edit Task' : 'Add Task' }}</h2>

      <form class="ptt-form" @submit="onSubmit">
        <div class="ptt-form__field">
          <input
            v-model="title"
            class="ptt-input"
            placeholder="Task Title"
          />
          <span
            v-if="titleError"
            class="ptt-modal__error"
            >{{ titleError }}</span
          >
        </div>

        <div class="ptt-form__field">
          <textarea
            v-model="description"
            class="ptt-textarea"
            placeholder="Description (optional)"
          />
          <span
            v-if="descriptionError"
            class="ptt-modal__error"
            >{{ descriptionError }}</span
          >
        </div>

        <div class="ptt-form__field">
          <input
            v-model="assignee"
            class="ptt-input"
            placeholder="Assignee (optional)"
          />
          <span
            v-if="assigneeError"
            class="ptt-modal__error"
            >{{ assigneeError }}</span
          >
        </div>

        <div class="ptt-form__field">
          <select v-model="status" class="ptt-select">
            <option :value="TaskStatus.todo">To Do</option>
            <option :value="TaskStatus.in_progress">In Progress</option>
            <option :value="TaskStatus.done">Done</option>
          </select>
          <span
            v-if="statusError"
            class="ptt-modal__error"
            >{{ statusError }}</span
          >
        </div>

        <div class="ptt-form__field">
          <input
            v-model="dueDate"
            class="ptt-input"
            type="date"
          />
          <span
            v-if="dueDateError"
            class="ptt-modal__error"
            >{{ dueDateError }}</span
          >
        </div>

        <div class="ptt-form__actions">
          <button type="submit" class="ptt-button">{{ isEditing ? 'Save' : 'Create' }}</button>
          <button
            type="button"
            class="ptt-button ptt-button--secondary"
            @click="emit('close')"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
