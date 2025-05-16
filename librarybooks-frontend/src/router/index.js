import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DocGiaLayout from '@/layouts/DocGiaLayout.vue'
import HomeView from '@/views/HomeView.vue'
import NXBView from '@/views/NXBView.vue'
import SachView from '@/views/SachView.vue'
import NhanVienView from '@/views/NhanVienView.vue'
import DocGiaView from '@/views/DocGiaView.vue'
import TheoDoiMuonSachView from '@/views/TheoDoiMuonSachView.vue'
import HomeViewRead from '@/views/HomeViewRead.vue'
import TheMuonSach from '@/views/TheMuonSach.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin-home', component: HomeView },
        { path: 'nxb', name: 'admin-nxb', component: NXBView },
        { path: 'sach', name: 'admin-sach', component: SachView },
        { path: 'nhanvien', name: 'admin-nhanvien', component: NhanVienView },
        { path: 'docgia', name: 'admin-docgia', component: DocGiaView },
        { path: 'theodoimuonsach', name: 'admin-theodoimuonsach', component: TheoDoiMuonSachView },
      ]
    },
    {
      path: '/',
      component: DocGiaLayout,
      children: [
     
        { path: '', name: 'docgia-home', component: () => import('@/views/HomeViewRead.vue') },
        { path: ':id', name: 'home', component: () => import('@/views/HomeViewRead.vue') },
        { path: ':id/sach', name: 'sach', component: () => import('@/views/SachViewRead.vue') },
        { path: ':id/themuonsach', name: 'theodoimuonsach', component: TheMuonSach }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFound,
    },
  ]
})

export default router
