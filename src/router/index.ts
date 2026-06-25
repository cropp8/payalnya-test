import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';

import HomeSidebar from '@/components/sidebars/HomeSidebar.vue';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Projects' },

      components: {
        default: HomeView,
        sidebar: HomeSidebar,
      },
    },
  ],
});

export default router;
