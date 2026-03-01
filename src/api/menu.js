import request from '@/utils/request'

// 获取菜单树
export function getMenuTree() {
  return request({
    url: '/system/menu/tree/v1',
    method: 'get'
  })
}

// 根据ID获取菜单
export function getMenuById(id) {
  return request({
    url: `/system/menu/getMenuById/v1/${id}`,
    method: 'get'
  })
}

// 创建/更新菜单
export function saveMenu(data) {
  if (data.id) {
    return request({
      url: '/system/menu/updateMenu/v1',
      method: 'put',
      data
    })
  } else {
    return request({
      url: '/system/menu/createMenu/v1',
      method: 'post',
      data
    })
  }
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/system/menu/deleteMenuById/v1/${id}`,
    method: 'delete'
  })
}

// 修改菜单状态
export function updateMenuStatus(id, status) {
  return request({
    url: '/system/menu/updateStatus/v1',
    method: 'put',
    data: { id, status }
  })
}
