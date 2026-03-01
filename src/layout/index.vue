<template>
  <el-container class="layout-container">
    <!-- 桌面端侧边栏 -->
    <el-aside v-if="!isMobile" :width="userStore.asideWidth" class="layout-aside">
      <div class="logo">
        <span v-if="userStore.asideWidth === '250px'">JDeploy-Ops</span>
        <span v-else>JD</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="userStore.asideWidth === '64px'"
        :collapse-transition="false"
        router
      >
        <template v-for="menu in userStore.menus" :key="menu.path">
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.meta?.icon || 'Menu'" /></el-icon>
              <span>{{ menu.meta?.title || menu.name }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.meta?.icon || 'Document'" /></el-icon>
              <span>{{ child.meta?.title || child.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.meta?.icon || 'Menu'" /></el-icon>
            <span>{{ menu.meta?.title || menu.name }}</span>
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
        <span>JDeploy-Ops</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        @select="handleMenuSelect"
      >
        <template v-for="menu in userStore.menus" :key="menu.path">
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.meta?.icon || 'Menu'" /></el-icon>
              <span>{{ menu.meta?.title || menu.name }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.meta?.icon || 'Document'" /></el-icon>
              <span>{{ child.meta?.title || child.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.meta?.icon || 'Menu'" /></el-icon>
            <span>{{ menu.meta?.title || menu.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-drawer>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="handleToggle">
            <Expand v-if="!isMobile && userStore.asideWidth === '64px'" />
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
  height: 100vh;
}

.layout-aside {
  background: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  background: #263445;
}

.el-menu {
  border-right: none;
  background: #304156;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: #263445 !important;
  color: #fff;
}

:deep(.el-menu-item.is-active) {
  background: #409eff !important;
  color: #fff;
}

.layout-header {
  background: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-icon:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.layout-main {
  background: #f0f2f5;
  padding: 20px;
}

/* 移动端抽屉样式 */
.mobile-drawer :deep(.el-drawer__body) {
  padding: 0;
  background: #304156;
}

.mobile-drawer .el-menu {
  border-right: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .layout-header {
    padding: 0 15px;
  }

  .layout-main {
    padding: 15px;
  }

  .username {
    display: none;
  }

  .user-info {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .layout-main {
    padding: 10px;
  }

  .logo {
    font-size: 18px;
  }
}
</style>
