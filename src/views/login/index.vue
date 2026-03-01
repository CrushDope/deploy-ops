<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="brand">
          <h1>JDeploy-Ops</h1>
          <p>企业级应用部署与运维管理平台</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form">
          <h2>欢迎登录</h2>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="code">
              <div class="captcha-box">
                <el-input
                  v-model="loginForm.code"
                  placeholder="请输入验证码"
                  prefix-icon="Key"
                  size="large"
                  style="flex: 1"
                />
                <img
                  :src="captchaUrl"
                  alt="验证码"
                  class="captcha-img"
                  @click="refreshCaptcha"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :loading="loading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { setToken } from '@/utils/auth'
import { getCookie, setCookie } from '@/utils/auth'
import { successMsg, errorMsg } from '@/utils/common'
import { v4 as uuidv4 } from 'uuid'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  clientKey: ''
})

// 验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

// 验证码 URL
const captchaUrl = ref('')

// 初始化 clientKey
const initClientKey = () => {
  let clientKey = getCookie('client-key')
  if (!clientKey) {
    clientKey = uuidv4()
    setCookie('client-key', clientKey)
  }
  loginForm.clientKey = clientKey
}

// 刷新验证码
const refreshCaptcha = () => {
  const timestamp = new Date().getTime()
  captchaUrl.value = `/api/captcha/getCaptcha/v1?operation=login&clientId=${loginForm.clientKey}&t=${timestamp}`
}

// 登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login({
          username: loginForm.username,
          password: loginForm.password,
          code: loginForm.code,
          clientKey: loginForm.clientKey
        })

        if (res.code === 0) {
          setToken(res.data.token)
          successMsg('登录成功')
          router.push('/')
        } else {
          errorMsg(res.msg || '登录失败')
          refreshCaptcha()
        }
      } catch (error) {
        console.error('登录失败:', error)
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

// 键盘事件
const handleKeyup = (e) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}

onMounted(() => {
  initClientKey()
  refreshCaptcha()
  document.addEventListener('keyup', handleKeyup)
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyup)
})
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 900px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.brand h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: bold;
}

.brand p {
  font-size: 18px;
  opacity: 0.9;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-form {
  width: 100%;
  max-width: 350px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.captcha-box {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-img {
  width: 120px;
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.captcha-img:hover {
  opacity: 0.8;
}
</style>
