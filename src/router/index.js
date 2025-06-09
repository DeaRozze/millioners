import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes'

const routes = [
  {
    path: ROUTE_PATHS.HOME,
    name: ROUTE_NAMES.HOME,
    component: () => import('@/pages/WelcomePage.vue'),
  },
  {
    path: ROUTE_PATHS.GAME,
    name: ROUTE_NAMES.GAME,
    component: () => import('@/pages/GamePage.vue'),
  },
  {
    path: ROUTE_PATHS.RESULT,
    name: ROUTE_NAMES.RESULT,
    component: () => import('@/pages/ResultPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
