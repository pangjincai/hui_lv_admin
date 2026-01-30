<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">小汇手系统</div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admins">
            <el-icon><User /></el-icon>
            <span>管理员</span>
        </el-menu-item>
        <el-menu-item index="/exchange-rates">
            <el-icon><TrendCharts /></el-icon>
            <span>实时汇率</span>
        </el-menu-item>
        <el-menu-item index="/banks">
            <el-icon><OfficeBuilding /></el-icon>
            <span>银行管理</span>
        </el-menu-item>
        <el-menu-item index="/bank-rates">
            <el-icon><TrendCharts /></el-icon>
            <span>牌价管理</span>
        </el-menu-item>
        <el-menu-item index="/currencies">
            <el-icon><Money /></el-icon>
            <span>货币管理</span>
        </el-menu-item>
        <el-menu-item index="/deposits">
            <el-icon><Wallet /></el-icon>
            <span>存款管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
           <!-- Breadcrumb could go here -->
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              Admin <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Odometer, User, OfficeBuilding, Money, TrendCharts, ArrowDown, Wallet } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.aside {
  background-color: #304156;
  color: white;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  background-color: #2b2f3a;
  color: white;
  overflow: hidden;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
  height: 60px;
  box-sizing: border-box;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
