# JDeploy-Ops 前端项目

企业级应用部署与运维管理平台前端项目

## 技术栈

- Vue 3.5.29 - 渐进式 JavaScript 框架
- Vite 7.3.1 - 下一代前端构建工具
- Vue Router 4.2.2 - 官方路由管理器
- Pinia 2.1.7 - Vue 状态管理库
- Element Plus 2.3.6 - 基于 Vue 3 的组件库
- Axios 1.4.0 - HTTP 客户端
- NProgress 0.2.0 - 页面加载进度条

## 项目结构

```
src/
├── api/                    # API 接口模块
│   ├── auth.js            # 认证相关接口
│   └── captcha.js         # 验证码接口
├── assets/                # 静态资源
├── components/            # 通用组件
├── directives/            # 自定义指令
│   └── permission.js      # 权限控制指令
├── layout/                # 布局组件
│   └── index.vue          # 主布局
├── router/                # 路由配置
│   └── index.js           # 路由定义
├── stores/                # Pinia 状态管理
│   └── user.js            # 用户状态
├── utils/                 # 工具函数
│   ├── auth.js            # Token 管理
│   ├── common.js          # 通用工具
│   └── request.js         # Axios 封装
├── views/                 # 页面组件
│   ├── dashboard/         # 首页
│   ├── error/             # 错误页面
│   └── login/             # 登录页面
├── App.vue                # 根组件
├── main.js                # 应用入口
└── permission.js          # 路由守卫
```

## 功能特性

### 已实现功能

- ✅ 用户登录/登出
- ✅ 验证码验证
- ✅ Token 认证
- ✅ 路由守卫
- ✅ 动态路由
- ✅ 权限控制（路由级 + 按钮级）
- ✅ 用户信息管理
- ✅ 侧边栏菜单
- ✅ 响应式布局

### 权限控制

#### 1. 路由级权限

通过路由守卫 (`permission.js`) 实现：
- 未登录用户自动跳转到登录页
- 已登录用户根据权限动态加载路由
- 无权限访问的路由自动拦截

#### 2. 按钮级权限

使用 `v-permission` 指令：

```vue
<el-button v-permission="['user:add']">添加用户</el-button>
<el-button v-permission="['user:edit', 'user:delete']">编辑</el-button>
```

在 JS 代码中检查权限：

```javascript
import { hasPermission } from '@/directives/permission'

if (hasPermission(['user:add'])) {
  // 有权限执行的操作
}
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 环境配置

### 开发环境 (.env.development)

```
VITE_APP_TITLE=JDeploy-Ops 部署运维平台
VITE_APP_BASE_API=/api
VITE_APP_PORT=5173
```

### 生产环境 (.env.production)

```
VITE_APP_TITLE=JDeploy-Ops 部署运维平台
VITE_APP_BASE_API=/api
```

## API 代理配置

开发环境下，所有 `/api` 开头的请求会被代理到后端服务器：

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 后端接口对接

### 登录接口

```
POST /api/auth/login/v1
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "code": "1234",
  "clientKey": "uuid"
}

Response:
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 获取用户信息

```
GET /api/auth/getInfo/v1
Authorization: Bearer {token}

Response:
{
  "code": 0,
  "msg": "success",
  "data": {
    "username": "admin",
    "menus": [...],
    "permissions": ["user:add", "user:edit", ...]
  }
}
```

### 验证码接口

```
GET /api/captcha/getCaptcha/v1?operation=login&clientId={uuid}

Response: 图片流 (image/gif)
```

## 默认账号

根据后端初始化脚本，默认管理员账号：

- 用户名：admin
- 密码：admin123

## 开发规范

### 组件命名

- 页面组件：使用 PascalCase，如 `UserList.vue`
- 通用组件：使用 PascalCase，如 `FormDialog.vue`

### API 模块

- 按业务模块划分，如 `auth.js`、`user.js`、`node.js`
- 统一使用 `request` 工具发起请求
- 返回 Promise

### 状态管理

- 使用 Pinia 进行状态管理
- 按模块划分 Store，如 `user.js`、`app.js`
- 使用 Composition API 风格

### 路由配置

- 静态路由：登录页、404 页面
- 动态路由：根据用户权限动态加载
- 路由 meta 信息：`title`、`icon`、`permission`

## 注意事项

1. 确保后端服务已启动（默认端口 8080）
2. 首次登录需要输入验证码
3. Token 存储在 Cookie 中，过期后自动跳转登录页
4. 开发环境下支持热更新

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT
