import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NXBView from '@/views/NXBView.vue'
import SachView from '@/views/SachView.vue'
import NhanVienView from '@/views/NhanVienView.vue'
import DocGiaView from '@/views/DocGiaView.vue'
import TheoDoiMuonSachView from '@/views/TheoDoiMuonSachView.vue'

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
      path: '/nxb',
      name:'nxb',
      component: NXBView
    },
    {
      path: '/sach',
      name:'sach',
      component: SachView
    },
    {
      path: '/nhanvien',
      name: 'nhanvien',
      component: NhanVienView
    },
    {
      path: '/docgia',
      name: 'docgia',
      component: DocGiaView
    },
    {
      path:'/theodoimuonsach',
      name:'theodoimuonsach',
      component: TheoDoiMuonSachView
    },
  ]
})

export default router
