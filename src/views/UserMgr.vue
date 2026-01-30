<template>
  <div>
    <div class="header-actions">
      <h2>管理员管理</h2>
      <div class="search-box">
        <el-input v-model="searchKeyword" placeholder="搜索用户名" style="width: 200px; margin-right: 10px;" @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleAdd">新增管理员</el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="ID" label="ID" width="80" />
      <el-table-column prop="Username" label="用户名" />
      <el-table-column prop="Salt" label="Salt" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增管理员' : '编辑管理员'">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.Username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.Password" type="password" placeholder="留空则不修改" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' or 'edit'
const form = reactive({
  ID: null,
  Username: '',
  Password: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/admins', { params: { username: searchKeyword.value } })
    if (res.data.code === 1) {
      tableData.value = res.data.data
    }
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}

const handleSearch = () => {
  fetchData()
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.ID = null
  form.Username = ''
  form.Password = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.ID = row.ID
  form.Username = row.Username
  form.Password = ''
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该管理员吗?', '警告', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' })
    .then(async () => {
      try {
        await api.delete(`/admins/${row.ID}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (e) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

const handleSave = async () => {
  try {
    let res
    if (dialogType.value === 'add') {
      res = await api.post('/admins', { Username: form.Username, Password: form.Password })
    } else {
      res = await api.put(`/admins/${form.ID}`, { Username: form.Username, Password: form.Password })
    }

    if (res.data.code === 1) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.data.msg)
    }
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
