<template>
  <el-container class="layout-container">
    <!-- 桌面端侧边栏 -->
    <el-aside v-if="!isMobile" :width="userStore.asideWidth" class="layout-aside">
      <div class="logo">
        <div class="logo-icon">JD</div>
        <div class="logo-text">
          <div class="logo-title">JDeploy-Ops</div>
          <div class="logo-subtitle">Dashboard v1.0</div>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="userStore.asideWidth === '80px'"
        :collapse-transition="false"
        router
      >
        <template v-for="menu in userStore.menus" :key="menu.id">
          <el-sub-menu v-if="menu.childList && menu.childList.length > 0" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.childList"
              :key="child.id"
              :index="child.path"
            >
              <el-icon><component :is="child.icon || 'Document'" /></el-icon>
              <span>{{ child.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      direction="ltr"
      size="250px"
      class="mobile-drawer"
    >
      <div class="logo">
        <div class="logo-icon">JD</div>
        <div class="logo-text">
          <div class="logo-title">JDeploy-Ops</div>
          <div class="logo-subtitle">Dashboard v1.0</div>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        @select="handleMenuSelect"
      >
        <template v-for="menu in userStore.menus" :key="menu.id">
          <el-sub-menu v-if="menu.childList && menu.childList.length > 0" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.childList"
              :key="child.id"
              :index="child.path"
            >
              <el-icon><component :is="child.icon || 'Document'" /></el-icon>
              <span>{{ child.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-drawer>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="handleToggle">
            <Expand v-if="!isMobile && userStore.asideWidth === '80px'" />
            <Fold v-else-if="!isMobile" />
            <Menu v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              <span class="username">{{ userStore.user.username || '用户' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showConfirm, successMsg } from '@/utils/common'
import { resetRouter } from '@/permission'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式状态
const isMobile = ref(false)
const drawerVisible = ref(false)

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    drawerVisible.value = false
  }
}

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 处理切换按钮
const handleToggle = () => {
  if (isMobile.value) {
    drawerVisible.value = !drawerVisible.value
  } else {
    userStore.toggleAsideWidth()
  }
}

// 移动端菜单选择后关闭抽屉
const handleMenuSelect = () => {
  if (isMobile.value) {
    drawerVisible.value = false
  }
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await showConfirm('确定要退出登录吗？')
      await userStore.logout()
      resetRouter()
      successMsg('退出登录成功')
      router.push('/login')
    } catch (error) {
      // 用户取消
    }
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
  padding: 16px;
  gap: 24px;
}

/* 重置 Element Plus 容器的默认样式 */
.layout-container :deep(.el-container) {
  width: 100%;
  height: 100%;
}

.layout-aside {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 32px);
  padding: 12px;
}

.layout-aside::-webkit-scrollbar {
  display: none;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 32px;
  flex-shrink: 0;
}

.logo-icon {
  min-width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}

.logo-text {
  margin-left: 16px;
  overflow: hidden;
  white-space: nowrap;
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
  line-height: 1;
}

.logo-subtitle {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 4px;
}

.el-menu {
  border-right: none;
  background: transparent;
  width: 100%;
  padding: 0 4px;
}

/* 收缩状态下的菜单样式 */
:deep(.el-menu--collapse) {
  width: 100%;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  padding: 0 !important;
  justify-content: center;
}

:deep(.el-menu--collapse .el-menu-item span),
:deep(.el-menu--collapse .el-sub-menu__title span) {
  display: none;
}

:deep(.el-menu--collapse .el-sub-menu__icon-arrow) {
  display: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 52px;
  line-height: 52px;
  border-radius: 14px;
  color: #64748b;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  overflow: visible;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  font-size: 24px;
  min-width: 44px;
  width: 44px;
  text-align: center;
  margin-right: 0;
  flex-shrink: 0;
}

:deep(.el-menu-item span),
:deep(.el-sub-menu__title span) {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
  margin-left: 8px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #4f46e5;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.1) !important;
}

:deep(.el-sub-menu__icon-arrow) {
  opacity: 1;
  transition: all 0.3s ease;
  position: static;
  margin-top: 0;
  line-height: 52px;
}

:deep(.el-sub-menu__title) {
  display: flex !important;
  align-items: center !important;
}

:deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  margin-left: auto;
  margin-right: 8px;
}

.layout-header {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 80px;
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  color: #64748b;
  padding: 8px;
  border-radius: 12px;
}

.toggle-icon:hover {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 16px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.5);
}

.user-info:hover {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-color: rgba(99, 102, 241, 0.2);
}

.user-info .el-icon {
  font-size: 20px;
  color: #6366f1;
}

.username {
  font-weight: 600;
  color: #1e293b;
}

.layout-main {
  background: transparent;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 136px);
  width: 100%;
}

.layout-main::-webkit-scrollbar {
  width: 6px;
}

.layout-main::-webkit-scrollbar-track {
  background: transparent;
}

.layout-main::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.layout-main::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* 移动端抽屉样式 */
.mobile-drawer :deep(.el-drawer__body) {
  padding: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

.mobile-drawer .el-menu {
  border-right: none;
  background: transparent;
}

.mobile-drawer .logo-text {
  opacity: 1;
  transform: translateX(0);
}

.mobile-drawer :deep(.el-menu-item span),
.mobile-drawer :deep(.el-sub-menu__title span) {
  opacity: 1;
  transform: translateX(0);
}

.mobile-drawer :deep(.el-sub-menu__icon-arrow) {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .layout-container {
    padding: 8px;
  }

  .layout-header {
    padding: 0 20px;
    height: 64px;
    margin-bottom: 16px;
  }

  .layout-main {
    height: calc(100vh - 96px);
  }

  .username {
    display: none;
  }

  .user-info {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .layout-container {
    padding: 4px;
  }

  .layout-header {
    padding: 0 16px;
    border-radius: 16px;
  }

  .logo-title {
    font-size: 16px;
  }
}
</style>
