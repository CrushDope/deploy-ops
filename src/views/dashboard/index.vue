<template>
  <div class="dashboard">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>欢迎使用 JDeploy-Ops 部署运维平台</span>
        </div>
      </template>
      <div class="welcome-content">
        <h2>系统概览</h2>
        <p>这是一个企业级应用部署与运维管理平台，采用 Master-Agent 分布式架构。</p>
        <el-row :gutter="20" style="margin-top: 30px">
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="在线节点" :value="0" />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="应用总数" :value="0" />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="部署任务" :value="0" />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="运行容器" :value="0" />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 这里可以添加数据获取逻辑
</script>

<style scoped>
.dashboard {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.welcome-content {
  padding: 20px;
}

.welcome-content h2 {
  margin-bottom: 10px;
  color: #333;
}

.welcome-content p {
  color: #666;
  line-height: 1.6;
}
</style>
