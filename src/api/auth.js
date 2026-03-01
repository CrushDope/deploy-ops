import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/auth/login/v1',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/auth/logout/v1',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/auth/getInfo/v1',
    method: 'get'
  })
}

// 检查 Token
export function checkToken() {
  return request({
    url: '/auth/checkToken/v1',
    method: 'get'
  })
}
