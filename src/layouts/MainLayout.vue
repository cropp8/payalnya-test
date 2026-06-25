<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
  <div class="ptt-wrapper">
    <AppHeader />
    <div class="ptt-app">
      <div class="ptt-sidebar">
        <slot name="sidebar"></slot>
      </div>
      <main class="ptt-main">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>
