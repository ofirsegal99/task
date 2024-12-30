import { createRouter, createWebHistory } from 'vue-router';
import WalletsPage from '@/components/WalletsPage.vue';

const routes = [
  {
    path: '/',
    component: WalletsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
