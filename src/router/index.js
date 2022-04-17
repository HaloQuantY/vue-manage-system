import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutComponent from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: LayoutComponent,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'users',
        component: () => import('@/views/users')
      },
      {
        path: 'rights',
        component: () => import('@/views/rights')
      },
      {
        path: 'roles',
        component: () => import('@/views/roles')
      },
      {
        path: 'categories',
        component: () => import('@/views/goods_category')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
