import router, { addRoutes } from './router'
import { useUserStore } from './stores/user'
import { getToken } from './utils/auth'
import { showFullLoading, hideFullLoading } from './utils/common'

let hasGetInfo = false

router.beforeEach(async (to, from, next) => {
  showFullLoading()

  const token = getToken()

  // 未登录且访问非登录页，重定向到登录页
  if (!token && to.path !== '/login') {
    hideFullLoading()
    return next({ path: '/login' })
  }

  // 已登录且访问登录页，重定向到首页
  if (token && to.path === '/login') {
    hideFullLoading()
    return next({ path: '/' })
  }

  // 已登录，获取用户信息和菜单
  let hasNewRoutes = false
  if (token && !hasGetInfo) {
    const userStore = useUserStore()
    try {
      const data = await userStore.getInfo()
      hasGetInfo = true
      // 动态添加路由
      if (data.menus && data.menus.length > 0) {
        // 根据后端返回的菜单树动态添加路由
        hasNewRoutes = addRoutes(data.menus)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      hideFullLoading()
      return next({ path: '/login' })
    }
  }

  // 设置页面标题
  const title = to.meta.title || 'JDeploy-Ops'
  document.title = `${title} - JDeploy-Ops 部署运维平台`

  // 如果有新路由，重新导航
  if (hasNewRoutes) {
    return next(to.fullPath)
  }

  next()
})

router.afterEach(() => {
  hideFullLoading()
})

// 重置路由守卫状态（用于退出登录）
export function resetRouter() {
  hasGetInfo = false
}
