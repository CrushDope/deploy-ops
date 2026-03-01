import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/api/auth/login/v1',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/api/auth/logout/v1',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/auth/getInfo/v1',
    method: 'get'
  })
}

// 检查 Token
export function checkToken() {
  return request({
    url: '/api/auth/checkToken/v1',
    method: 'get'
  })
}
