import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import ProjectView from '@/views/ProjectView.vue';
import TaskView from '@/views/TaskView.vue';
import HomeSidebar from '@/components/sidebars/HomeSidebar.vue';
import ProjectSidebar from '@/components/sidebars/ProjectSidebar.vue';
import TaskSidebar from '@/components/sidebars/TaskSidebar.vue';
import { useProjectStore } from '@/stores/projects';
import { useTaskStore } from '@/stores/tasks';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        breadcrumb: () => 'Projects',
      },

      components: {
        default: HomeView,
        sidebar: HomeSidebar,
      },
    },
    {
      path: '/projects/:id',
      name: 'project',
      meta: {
        breadcrumb: (route) => {
          const store = useProjectStore();
          return store.projects.find((p) => p.id === Number(route.params.id))?.name ?? 'Project';
        },
        parent: () => ({ name: 'home' }),
      },

      components: {
        default: ProjectView,
        sidebar: ProjectSidebar,
      },
    },
    {
      path: '/tasks/:id',
      name: 'task',
      meta: {
        breadcrumb: (route) => {
          const store = useTaskStore();
          return store.tasks.find((t) => t.id === Number(route.params.id))?.title ?? 'Task';
        },
        parent: (route) => {
          const task = useTaskStore().tasks.find((t) => t.id === Number(route.params.id));
          return task ? { name: 'project', params: { id: task.projectId } } : null;
        },
      },

      components: {
        default: TaskView,
        sidebar: TaskSidebar,
      },
    },
  ],
});

export default router;
