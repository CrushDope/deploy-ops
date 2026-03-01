import request from '@/utils/request'

// 获取角色列表（分页）
export function getRoleList(params) {
  return request({
    url: '/system/role/page/v1',
    method: 'get',
    params
  })
}

// 获取所有角色（不分页）
export function getAllRoles() {
  return request({
    url: '/system/role/list/v1',
    method: 'get'
  })
}

// 根据ID获取角色
export function getRoleById(id) {
  return request({
    url: `/system/role/getRoleById/v1/${id}`,
    method: 'get'
  })
}

// 创建/更新角色
export function saveRole(data) {
  if (data.id) {
    return request({
      url: '/system/role/updateRole/v1',
      method: 'put',
      data
    })
  } else {
    return request({
      url: '/system/role/createRole/v1',
      method: 'post',
      data
    })
  }
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/system/role/deleteRoleById/v1/${id}`,
    method: 'delete'
  })
}

// 修改角色状态
export function updateRoleStatus(id, status) {
  return request({
    url: '/system/role/updateStatus/v1',
    method: 'put',
    data: { id, status }
  })
}

// 获取角色菜单树
export function getRoleMenuTree(roleId) {
  return request({
    url: `/system/role/getMenuTree/v1/${roleId}`,
    method: 'get'
  })
}

// 保存角色菜单权限
export function saveRoleMenu(data) {
  return request({
    url: '/system/role/saveMenu/v1',
    method: 'post',
    data
  })
}
