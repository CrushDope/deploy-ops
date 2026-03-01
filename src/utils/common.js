import { ElNotification, ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 nprogress
nprogress.configure({
  showSpinner: false
})

// 成功提示
export function successMsg(msg) {
  ElNotification({
    message: msg,
    type: 'success',
    duration: 3000
  })
}

// 错误提示
export function errorMsg(msg) {
  ElNotification({
    message: msg,
    type: 'error',
    duration: 3000
  })
}

// 警告提示
export function warningMsg(msg) {
  ElNotification({
    message: msg,
    type: 'warning',
    duration: 3000
  })
}

// 信息提示
export function infoMsg(msg) {
  ElNotification({
    message: msg,
    type: 'info',
    duration: 3000
  })
}

// 确认对话框
export function showConfirm(content, title = '提示', type = 'warning') {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type
  })
}

// 显示全局加载进度条
export function showFullLoading() {
  nprogress.start()
}

// 隐藏全局加载进度条
export function hideFullLoading() {
  nprogress.done()
}
