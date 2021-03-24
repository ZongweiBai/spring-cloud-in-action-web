import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
    },
    {
        path: '/oauth2',
        component: Layout,
        redirect: '/oauth2/home',
        name: 'OAuth2鉴权管理',
        meta: { title: 'OAuth2鉴权管理', icon: 'table' },
        children: [
        //   {
        //     path: '/home',
        //     component: () => import('../views/Home.vue'),
        //     meta: { title: 'home' }
        //   },
          {
            path: 'client',
            component: () => import('@/views/oauth2/client/index'),
            meta: { title: '客户端管理' }
          },
          {
            path: 'token',
            component: () => import('@/views/oauth2/token/index'),
            meta: { title: 'Token管理' }
          },
          {
            path: 'client3',
            component: () => import('@/views/oauth2/client/index'),
            meta: { title: '权限控制' }
          }
        ]
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const createRouter = () => new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
  }

export default router
