<template>
  <div class="role-container">
    <el-card>
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
        <el-button text @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="roleList"
        stripe
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="角色名称" prop="name" min-width="150" />
        <el-table-column label="角色描述" prop="remark" min-width="200" />
        <el-table-column label="数据权限" min-width="120">
          <template #default="{ row }">
            {{ getDataScopeText(row.dataScope) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              :loading="row.switchLoading"
              :before-change="() => handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="160" />
        <el-table-column label="操作" fixed="right" min-width="200">
          <template #default="{ row }">
            <el-button type="primary" text @click="handlePermission(row)">配置权限</el-button>
            <el-button type="warning" text @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" text @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="roleForm.remark" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="数据权限" prop="dataScope">
          <el-select v-model="roleForm.dataScope" placeholder="请选择数据权限范围">
            <el-option label="全部数据权限" value="1" />
            <el-option label="自定义数据权限" value="2" />
            <el-option label="本部门数据权限" value="3" />
            <el-option label="本部门及以下数据权限" value="4" />
            <el-option label="仅本人数据权限" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="roleForm.sort" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="roleForm.status"
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

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="配置权限"
      width="600px"
      @close="handlePermissionDialogClose"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="menuTree"
        :props="treeProps"
        :default-checked-keys="checkedKeys"
        node-key="id"
        show-checkbox
        default-expand-all
      >
        <template #default="{ node, data }">
          <span class="tree-node">
            <el-tag :type="data.menuType === 'M' ? '' : 'warning'" size="small">
              {{ data.menuType === 'M' ? '菜单' : data.menuType === 'C' ? '目录' : '按钮' }}
            </el-tag>
            <el-icon v-if="data.icon" class="ml-2">
              <component :is="data.icon" />
            </el-icon>
            <span class="ml-2">{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="permissionSubmitLoading" @click="handlePermissionSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const submitLoading = ref(false)
const roleFormRef = ref(null)

const permissionDialogVisible = ref(false)
const permissionSubmitLoading = ref(false)
const permissionTreeRef = ref(null)
const currentRoleId = ref(null)
const menuTree = ref([])
const checkedKeys = ref([])

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 角色列表
const roleList = ref([])

// 角色表单
const roleForm = reactive({
  id: null,
  name: '',
  remark: '',
  dataScope: '1',
  sort: 0,
  status: '0'
})

// 树形控件配置
const treeProps = {
  children: 'children',
  label: 'menuName'
}

// 表单验证规则
const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  dataScope: [
    { required: true, message: '请选择数据权限范围', trigger: 'change' }
  ]
}

// 获取数据权限文本
const getDataScopeText = (dataScope) => {
  const map = {
    '1': '全部数据',
    '2': '自定义数据',
    '3': '本部门数据',
    '4': '本部门及以下',
    '5': '仅本人数据'
  }
  return map[dataScope] || '未知'
}

// 获取角色列表
const getRoleList = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取角色列表
    // const res = await getRoleListApi({
    //   current: pagination.current,
    //   size: pagination.size
    // })
    // roleList.value = res.data.records
    // pagination.total = res.data.total

    // 模拟数据
    roleList.value = []
    pagination.total = 0
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新
const handleRefresh = () => {
  getRoleList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑角色'
  Object.assign(roleForm, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除角色【${row.name}】吗？`, '提示', {
      type: 'warning'
    })
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    getRoleList()
  } catch (error) {
    // 用户取消
  }
}

// 状态切换
const handleStatusChange = async (row) => {
  row.switchLoading = true
  try {
    // TODO: 调用状态切换API
    ElMessage.success('状态修改成功')
    return true
  } catch (error) {
    ElMessage.error('状态修改失败')
    return false
  } finally {
    row.switchLoading = false
  }
}

// 配置权限
const handlePermission = async (row) => {
  currentRoleId.value = row.id
  row.loading = true
  try {
    // TODO: 调用API获取菜单树和已选中的权限
    // const res = await getRoleMenuTreeApi(row.id)
    // menuTree.value = res.data.menuTree
    // checkedKeys.value = res.data.checkedKeys

    // 模拟数据
    menuTree.value = []
    checkedKeys.value = []
    permissionDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取权限数据失败')
  } finally {
    row.loading = false
  }
}

// 提交权限配置
const handlePermissionSubmit = async () => {
  permissionSubmitLoading.value = true
  try {
    const checkedNodes = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedNodes = permissionTreeRef.value.getHalfCheckedKeys()
    const menuIds = [...checkedNodes, ...halfCheckedNodes]

    // TODO: 调用API保存权限配置
    // await saveRoleMenuApi({
    //   roleId: currentRoleId.value,
    //   menuIds
    // })

    ElMessage.success('权限配置成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限配置失败')
  } finally {
    permissionSubmitLoading.value = false
  }
}

// 分页大小变化
const handleSizeChange = () => {
  getRoleList()
}

// 当前页变化
const handleCurrentChange = () => {
  getRoleList()
}

// 提交表单
const handleSubmit = async () => {
  await roleFormRef.value.validate()
  submitLoading.value = true
  try {
    // TODO: 调用保存API
    ElMessage.success(roleForm.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    getRoleList()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 对话框关闭
const handleDialogClose = () => {
  roleFormRef.value?.resetFields()
  Object.assign(roleForm, {
    id: null,
    name: '',
    remark: '',
    dataScope: '1',
    sort: 0,
    status: '0'
  })
}

// 权限对话框关闭
const handlePermissionDialogClose = () => {
  currentRoleId.value = null
  menuTree.value = []
  checkedKeys.value = []
}

onMounted(() => {
  getRoleList()
})
</script>

<style scoped>
.role-container {
  width: 100%;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.tree-node {
  display: flex;
  align-items: center;
}

.ml-2 {
  margin-left: 8px;
}
</style>

