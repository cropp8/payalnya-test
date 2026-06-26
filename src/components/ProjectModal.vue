<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { projectSchema, type ProjectFormValues } from '@/schemas/projectSchema';
import { ProjectStatus } from '@/types';

const props = defineProps<{
  initialValues?: ProjectFormValues;
}>();

const emit = defineEmits(['close', 'submit']);

const isEditing = !!props.initialValues;

const { handleSubmit, resetForm } = useForm<ProjectFormValues>({
  validationSchema: toTypedSchema(projectSchema),
  initialValues: props.initialValues ?? {
    name: '',
    description: '',
    status: ProjectStatus.active,
  },
});

const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: description, errorMessage: descriptionError } = useField<string>('description');
const { value: status, errorMessage: statusError } = useField<ProjectStatus>('status');

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
      <h2 class="ptt-heading ptt-modal__title ptt-mb">{{ isEditing ? 'Edit Project' : 'Add Project' }}</h2>

      <form class="ptt-form" @submit="onSubmit">
        <div class="ptt-form__field">
          <input
            v-model="name"
            class="ptt-input"
            placeholder="Project Name"
          />
          <span
            v-if="nameError"
            class="ptt-modal__error"
            >{{ nameError }}</span
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
          <select v-model="status" class="ptt-select">
            <option :value="ProjectStatus.active">Active</option>
            <option :value="ProjectStatus.archived">Archived</option>
          </select>
          <span
            v-if="statusError"
            class="ptt-modal__error"
            >{{ statusError }}</span
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
