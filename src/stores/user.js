import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, logout as logoutApi } from '@/api/auth'
import { removeToken, removeRefreshToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref({})
  const menus = ref([])
  const permissions = ref([])
  const asideWidth = ref('250px')

  // 获取用户信息
  async function getInfo() {
    try {
      const res = await getUserInfo()
      user.value = res.data
      menus.value = res.data.menus || []
      permissions.value = res.data.permissions || []
      return res.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 退出登录
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      // 清除本地数据
      user.value = {}
      menus.value = []
      permissions.value = []
      removeToken()
      removeRefreshToken()
    }
  }

  // 切换侧边栏宽度
  function toggleAsideWidth() {
    asideWidth.value = asideWidth.value === '250px' ? '80px' : '250px'
  }

  // 检查权限
  function hasPermission(permission) {
    if (!permission) return true
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.value.includes(p))
    }
    return permissions.value.includes(permission)
  }

  return {
    user,
    menus,
    permissions,
    asideWidth,
    getInfo,
    logout,
    toggleAsideWidth,
    hasPermission
  }
})
