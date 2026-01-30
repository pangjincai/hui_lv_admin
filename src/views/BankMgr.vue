<template>
  <div>
    <div class="header-actions">
      <h2>银行管理</h2>
      <div class="search-box">
        <el-input v-model="searchKeyword" placeholder="搜索银行代码/名称" style="width: 200px; margin-right: 10px;" @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleAdd">新增银行</el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="ID" label="ID" width="80" />
      <el-table-column prop="Code" label="编码" />
      <el-table-column prop="Name" label="名称" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增银行' : '编辑银行'">
      <el-form :model="form" label-width="80px">
        <el-form-item label="编码">
          <el-input v-model="form.Code" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.Name" />
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
  Code: '',
  Name: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/banks', { params: { keyword: searchKeyword.value } })
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
  form.Code = ''
  form.Name = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.ID = row.ID
  form.Code = row.Code
  form.Name = row.Name
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该银行吗?', '警告', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' })
    .then(async () => {
      try {
        await api.delete(`/banks/${row.ID}`)
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
      res = await api.post('/banks', { Code: form.Code, Name: form.Name })
    } else {
      res = await api.put(`/banks/${form.ID}`, { Code: form.Code, Name: form.Name })
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
