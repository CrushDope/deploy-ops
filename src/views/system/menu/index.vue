<template>
  <div class="menu-container">
    <el-card>
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">新增菜单</el-button>
        <el-button text @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>

      <el-tree
        v-loading="loading"
        :data="menuTree"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <div class="node-info">
              <el-tag :type="getMenuTypeTag(data.menuType)" size="small">
                {{ getMenuTypeText(data.menuType) }}
              </el-tag>
              <el-icon v-if="data.icon" class="ml-2">
                <component :is="data.icon" />
              </el-icon>
              <span class="ml-2">{{ data.menuName }}</span>
            </div>
            <div class="node-actions">
              <el-switch
                v-model="data.status"
                active-value="0"
                inactive-value="1"
                :loading="data.switchLoading"
                :before-change="() => handleStatusChange(data)"
              />
              <el-button type="primary" text @click="handleEdit(data)">修改</el-button>
              <el-button
                v-if="data.menuType !== 'F'"
                type="success"
                text
                @click="handleAddChild(data)"
              >
                添加
              </el-button>
              <el-button type="danger" text @click="handleDelete(data)">删除</el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeSelect"
            :props="treeSelectProps"
            check-strictly
            clearable
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入图标名称（Element Plus图标）" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="路由地址" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType === 'C'" label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType === 'F'" label="权限标识" prop="perms">
          <el-input v-model="menuForm.perms" placeholder="请输入权限标识，如：system:user:add" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="是否外链" prop="isFrame">
          <el-radio-group v-model="menuForm.isFrame">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="是否缓存" prop="isCache">
          <el-radio-group v-model="menuForm.isCache">
            <el-radio label="0">缓存</el-radio>
            <el-radio label="1">不缓存</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="显示状态" prop="visible">
          <el-radio-group v-model="menuForm.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-switch
            v-model="menuForm.status"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const submitLoading = ref(false)
const menuFormRef = ref(null)

// 菜单树
const menuTree = ref([])

// 树形控件配置
const treeProps = {
  children: 'children',
  label: 'menuName'
}

// 树形选择器配置
const treeSelectProps = {
  children: 'children',
  label: 'menuName',
  value: 'id'
}

// 菜单表单
const menuForm = reactive({
  id: null,
  parentId: null,
  menuType: 'M',
  menuName: '',
  icon: '',
  path: '',
  component: '',
  perms: '',
  orderNum: 0,
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0'
})

// 表单验证规则
const menuRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  menuType: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  orderNum: [
    { required: true, message: '请输入显示排序', trigger: 'blur' }
  ]
}

// 菜单树选择器数据（添加顶级选项）
const menuTreeSelect = computed(() => {
  return [
    {
      id: 0,
      menuName: '顶级菜单',
      children: menuTree.value
    }
  ]
})

// 获取菜单类型标签
const getMenuTypeTag = (type) => {
  const map = {
    'M': '',
    'C': 'success',
    'F': 'warning'
  }
  return map[type] || ''
}

// 获取菜单类型文本
const getMenuTypeText = (type) => {
  const map = {
    'M': '目录',
    'C': '菜单',
    'F': '按钮'
  }
  return map[type] || '未知'
}

// 获取菜单树
const getMenuTree = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取菜单树
    // const res = await getMenuTreeApi()
    // menuTree.value = res.data

    // 模拟数据
    menuTree.value = []
  } catch (error) {
    ElMessage.error('获取菜单树失败')
  } finally {
    loading.value = false
  }
}

// 刷新
const handleRefresh = () => {
  getMenuTree()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增菜单'
  menuForm.parentId = 0
  dialogVisible.value = true
}

// 添加子菜单
const handleAddChild = (data) => {
  dialogTitle.value = '新增子菜单'
  menuForm.parentId = data.id
  dialogVisible.value = true
}

// 编辑
const handleEdit = (data) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(menuForm, data)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (data) => {
  try {
    const msg = data.menuType === 'M'
      ? `确定删除目录【${data.menuName}】及其子菜单吗？`
      : `确定删除【${data.menuName}】吗？`

    await ElMessageBox.confirm(msg, '提示', {
      type: 'warning'
    })
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    getMenuTree()
  } catch (error) {
    // 用户取消
  }
}

// 状态切换
const handleStatusChange = async (data) => {
  data.switchLoading = true
  try {
    // TODO: 调用状态切换API
    ElMessage.success('状态修改成功')
    return true
  } catch (error) {
    ElMessage.error('状态修改失败')
    return false
  } finally {
    data.switchLoading = false
  }
}

// 提交表单
const handleSubmit = async () => {
  await menuFormRef.value.validate()
  submitLoading.value = true
  try {
    // TODO: 调用保存API
    ElMessage.success(menuForm.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    getMenuTree()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 对话框关闭
const handleDialogClose = () => {
  menuFormRef.value?.resetFields()
  Object.assign(menuForm, {
    id: null,
    parentId: null,
    menuType: 'M',
    menuName: '',
    icon: '',
    path: '',
    component: '',
    perms: '',
    orderNum: 0,
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0'
  })
}

onMounted(() => {
  getMenuTree()
})
</script>

<style scoped>
.menu-container {
  width: 100%;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}

.node-info {
  display: flex;
  align-items: center;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ml-2 {
  margin-left: 8px;
}

:deep(.el-tree-node__content) {
  padding: 15px 0;
}
</style>

