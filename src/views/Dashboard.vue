<template>
  <div class="dashboard-container">
    <h2>仪表盘</h2>
    <div class="stats-cards">
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span>管理员总数</span>
          </div>
        </template>
        <div class="card-value">{{ stats.admin_count }}</div>
      </el-card>
      <el-card class="stat-card">
         <template #header>
          <div class="card-header">
            <span>银行总数</span>
          </div>
        </template>
        <div class="card-value">{{ stats.bank_count }}</div>
      </el-card>
      <el-card class="stat-card">
         <template #header>
          <div class="card-header">
            <span>货币总数</span>
          </div>
        </template>
        <div class="card-value">{{ stats.currency_count }}</div>
      </el-card>
      <el-card class="stat-card">
         <template #header>
          <div class="card-header">
            <span>汇率记录数</span>
          </div>
        </template>
        <div class="card-value">{{ stats.rate_count }}</div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const stats = ref({
  admin_count: 0,
  bank_count: 0,
  currency_count: 0,
  rate_count: 0
})

const fetchStats = async () => {
  try {
    const res = await api.get('/stats')
    if (res.data.code === 1) {
      stats.value = res.data.data
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.stats-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.stat-card {
  width: 250px;
}
.card-header {
  font-weight: bold;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
}
</style>
