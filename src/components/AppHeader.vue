<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const crumbs = [{ name: 'Home', path: '/' }];

  if (route.name !== 'projects') {
    crumbs.push({ name: route.meta.title as string, path: route.path });
  }

  return crumbs;
});
</script>

<template>
  <header class="ptt-header">
    <nav class="ptt-breadcrumbs">
      <template
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
      >
        <RouterLink
          :to="crumb.path"
          class="ptt-link ptt-breadcrumbs__link"
          >{{ crumb.name }}</RouterLink
        >
        <span
          v-if="index < breadcrumbs.length - 1"
          class="separator"
        >
          /
        </span>
      </template>
    </nav>
  </header>
</template>
