<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { projectSchema, type ProjectFormValues } from '@/schemas/projectSchema';
import { ProjectStatus } from '@/types';

const emit = defineEmits(['close', 'submit']);

const { handleSubmit, resetForm } = useForm<ProjectFormValues>({
  validationSchema: toTypedSchema(projectSchema),
  initialValues: {
    name: '',
    status: ProjectStatus.active,
  },
});

const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: status, errorMessage: statusError } = useField<ProjectStatus>('status');

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
      <h2>Add Project</h2>

      <form @submit="onSubmit">
        <div>
          <input
            v-model="name"
            placeholder="Project Name"
          />
          <span
            v-if="nameError"
            class="error"
            >{{ nameError }}</span
          >
        </div>

        <div>
          <select v-model="status">
            <option :value="ProjectStatus.active">Active</option>
            <option :value="ProjectStatus.archived">Archived</option>
          </select>
          <span
            v-if="statusError"
            class="error"
            >{{ statusError }}</span
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
