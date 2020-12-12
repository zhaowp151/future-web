import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/errPage/Page404.vue') },
]




const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
