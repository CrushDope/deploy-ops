import request from '@/utils/request'

// 获取用户列表（分页）
export function getUserList(params) {
  return request({
    url: '/system/user/page/v1',
    method: 'get',
    params
  })
}

// 根据ID获取用户
export function getUserById(id) {
  return request({
    url: `/system/user/getUserById/v1/${id}`,
    method: 'get'
  })
}

// 创建/更新用户
export function saveUser(data) {
  if (data.id) {
    return request({
      url: '/system/user/updateUser/v1',
      method: 'put',
      data
    })
  } else {
    return request({
      url: '/system/user/createUser/v1',
      method: 'post',
      data
    })
  }
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/system/user/deleteUserById/v1/${id}`,
    method: 'delete'
  })
}

// 批量删除用户
export function batchDeleteUsers(ids) {
  return request({
    url: '/system/user/batchDelete/v1',
    method: 'delete',
    data: ids
  })
}

// 修改用户状态
export function updateUserStatus(id, status) {
  return request({
    url: '/system/user/updateStatus/v1',
    method: 'put',
    data: { id, status }
  })
}
