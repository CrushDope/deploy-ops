import { useUserStore } from '@/stores/user'

export default {
  install(app) {
    // v-permission 指令
    app.directive('permission', {
      mounted(el, binding) {
        const { value } = binding
        const userStore = useUserStore()

        if (value && value instanceof Array && value.length > 0) {
          const hasPermission = userStore.hasPermission(value)

          if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        } else {
          throw new Error('需要传入权限数组，例如 v-permission="[\'user:add\', \'user:edit\']"')
        }
      }
    })
  }
}

// 权限检查函数（用于 JS 代码中）
export function hasPermission(permission) {
  const userStore = useUserStore()
  return userStore.hasPermission(permission)
}
