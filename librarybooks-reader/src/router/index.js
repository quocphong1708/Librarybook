import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () => import("@/views/NotFound.vue"),
    },
    {
      path: "/:id",
      name: "wellcom",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/:id/sach",
      name: "sach",
      component: () => import("@/views/SachView.vue"),
    },
    {
      path: "/:id/themuonsach",
      name: "theodoimuonsach",
      component: () => import("@/views/TheMuonSach.vue")
    }
  ]
})

export default router
