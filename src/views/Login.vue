<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">小汇手管理系统</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="Username" prefix-icon="User" size="large"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="Password" prefix-icon="Lock" size="large" show-password/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" w-full style="width: 100%" size="large">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const result = await authStore.login(form.username, form.password)
      loading.value = false
      if (result.success) {
        ElMessage.success('Login Successful')
        router.push('/')
      } else {
        ElMessage.error(result.msg || 'Login Failed')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}
</style>
