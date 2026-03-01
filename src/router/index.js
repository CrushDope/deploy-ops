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
    path: '/system/user',
    name: '/system/user',
    component: () => import('@/views/system/user/index.vue'),
    meta: { title: '用户管理', icon: 'User' }
  },
  {
    path: '/system/role',
    name: '/system/role',
    component: () => import('@/views/system/role/index.vue'),
    meta: { title: '角色管理', icon: 'UserFilled' }
  },
  {
    path: '/system/menu',
    name: '/system/menu',
    component: () => import('@/views/system/menu/index.vue'),
    meta: { title: '菜单管理', icon: 'Menu' }
  },
  {
    path: '/ops/node',
    name: '/ops/node',
    component: () => import('@/views/ops/node/index.vue'),
    meta: { title: '节点管理', icon: 'Server' }
  },
  {
    path: '/ops/app',
    name: '/ops/app',
    component: () => import('@/views/ops/app/index.vue'),
    meta: { title: '应用管理', icon: 'Box' }
  },
  {
    path: '/ops/deploy',
    name: '/ops/deploy',
    component: () => import('@/views/ops/deploy/index.vue'),
    meta: { title: '部署任务', icon: 'Upload' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 动态添加路由
export function addRoutes(menus) {
  let hasNewRoutes = false
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach(e => {
      // 如果是目录（parentId = 0），遍历其子菜单
      if (e.childList && e.childList.length > 0) {
        findAndAddRoutesByMenus(e.childList)
      } else {
        // 如果是具体的菜单页面，查找对应的路由并添加
        const item = asyncRoutes.find(o => o.path === e.path)
        if (item && !router.hasRoute(item.path)) {
          router.addRoute('Layout', item)
          hasNewRoutes = true
        }
      }
    })
  }
  findAndAddRoutesByMenus(menus)
  return hasNewRoutes
}

export default router

