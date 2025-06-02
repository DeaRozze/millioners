import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '@/pages/WelcomePage.vue'
import GamePage from '@/pages/GamePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: WelcomePage,
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
