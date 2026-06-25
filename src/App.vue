<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>

<template>
  <MainLayout>
    <template #sidebar>
      <RouterView name="sidebar" />
    </template>

    <RouterView />
  </MainLayout>
</template>

<style scoped></style>
