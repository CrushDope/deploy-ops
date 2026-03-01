import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh-token'

// Token 操作
export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}

// RefreshToken 操作
export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token) {
  return Cookies.set(REFRESH_TOKEN_KEY, token)
}

export function removeRefreshToken() {
  return Cookies.remove(REFRESH_TOKEN_KEY)
}

// 通用 Cookie 操作
export function setCookie(key, value) {
  return Cookies.set(key, value)
}

export function getCookie(key) {
  return Cookies.get(key)
}

export function removeCookie(key) {
  return Cookies.remove(key)
}
