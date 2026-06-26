<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router';

const route = useRoute();
const router = useRouter();

type Crumb = {
  label: string;
  to: { name: string; params?: Record<string, string | number> } | string;
};

const breadcrumbs = computed(() => {
  const crumbs: Crumb[] = [];
  const currentRoute = route;

  if (currentRoute.meta.breadcrumb) {
    crumbs.push({ label: currentRoute.meta.breadcrumb(currentRoute), to: currentRoute.path });
  }

  let meta = currentRoute.meta;

  while (meta.parent) {
    const parentLocation = meta.parent(currentRoute);

    if (!parentLocation) break;

    const parentRoute = router.resolve(parentLocation);
    const parentMeta = parentRoute.meta;

    if (parentMeta.breadcrumb) {
      crumbs.unshift({
        label: parentMeta.breadcrumb(parentRoute as RouteLocationNormalizedLoaded),
        to: parentLocation,
      });
    }

    meta = parentMeta;
  }

  return crumbs;
});
</script>

<template>
  <header class="ptt-header">
    <nav class="ptt-breadcrumbs">
      <template
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
      >
        <span
          v-if="index > 0"
          class="ptt-breadcrumbs__separator"
        >
          >
        </span>
        <RouterLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.to"
          class="ptt-link ptt-breadcrumbs__link"
          >{{ crumb.label }}</RouterLink
        >
        <span
          v-else
          class="ptt-breadcrumbs__current"
          >{{ crumb.label }}</span
        >
      </template>
    </nav>
  </header>
</template>
