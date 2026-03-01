import { createRouter, createWebHashHistory } from 'vue-router'

// 静态路由
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  }
]

// 动态路由（根据权限动态添加）
export const asyncRoutes = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layout/index.vue'),
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'Menu' }
      }
    ]
  },
  {
    path: '/ops',
    name: 'Ops',
    component: () => import('@/layout/index.vue'),
    meta: { title: '运维管理', icon: 'Monitor' },
    children: [
      {
        path: '/ops/node',
        name: 'OpsNode',
        component: () => import('@/views/ops/node/index.vue'),
        meta: { title: '节点管理', icon: 'Server' }
      },
      {
        path: '/ops/app',
        name: 'OpsApp',
        component: () => import('@/views/ops/app/index.vue'),
        meta: { title: '应用管理', icon: 'Box' }
      },
      {
        path: '/ops/deploy',
        name: 'OpsDeploy',
        component: () => import('@/views/ops/deploy/index.vue'),
        meta: { title: '部署任务', icon: 'Upload' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 动态添加路由
export function addRoutes(menus) {
  let hasNewRoutes = false
  const findAndAddRoute = (arr) => {
    arr.forEach(menu => {
      const route = asyncRoutes.find(r => r.path === menu.path)
      if (route && !router.hasRoute(route.path)) {
        router.addRoute('Layout', route)
        hasNewRoutes = true
      }
      if (menu.children && menu.children.length > 0) {
        findAndAddRoute(menu.children)
      }
    })
  }
  findAndAddRoute(menus)
  return hasNewRoutes
}

export default router
