import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes'
import WelcomePage from '@/pages/WelcomePage.vue'

const routes = [
  {
    path: ROUTE_PATHS.HOME,
    name: ROUTE_NAMES.HOME,
    component: WelcomePage,
  },
  {
    path: ROUTE_PATHS.GAME,
    name: ROUTE_NAMES.GAME,
    component: () => import('@/pages/GamePage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
