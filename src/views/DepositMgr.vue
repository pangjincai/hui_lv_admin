<template>
  <div>
    <div class="header-actions">
      <h2>存款管理</h2>
      <div class="search-box">
        <el-select v-model="searchForm.bankID" placeholder="选择银行" @change="handleSearch" clearable style="width: 150px; margin-right: 10px;">
          <el-option v-for="item in bankOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="searchForm.currencyID" placeholder="选择货币" @change="handleSearch" clearable style="width: 150px; margin-right: 10px;">
          <el-option v-for="item in currencyOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleAdd">新增存款</el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="ID" label="ID" width="80" />
      <el-table-column label="银行">
        <template #default="scope">{{ scope.row.Bank?.Name }}</template>
      </el-table-column>
      <el-table-column label="货币">
         <template #default="scope">{{ scope.row.Currency?.Name }}</template>
      </el-table-column>
      <el-table-column prop="Name" label="产品名称" />
      <el-table-column prop="Time" label="存期" />
      <el-table-column prop="Rate" label="利率" />
      <el-table-column prop="Tips" label="备注" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增存款' : '编辑存款'">
      <el-form :model="form" label-width="80px">
        <el-form-item label="银行">
           <el-select v-model="form.BankID" placeholder="选择银行">
            <el-option v-for="item in bankOptions" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </el-form-item>
        <el-form-item label="货币">
           <el-select v-model="form.CurrencyID" placeholder="选择货币">
            <el-option v-for="item in currencyOptions" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="form.Name" />
        </el-form-item>
        <el-form-item label="存期">
          <el-input v-model="form.Time" placeholder="例如: 3个月" />
        </el-form-item>
        <el-form-item label="利率">
          <el-input v-model="form.Rate" placeholder="例如: 1.5%" />
        </el-form-item>
         <el-form-item label="备注">
          <el-input v-model="form.Tips" type="textarea" />
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
const bankOptions = ref([])
const currencyOptions = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')

const searchForm = reactive({
  bankID: '',
  currencyID: ''
})

const form = reactive({
  ID: null,
  BankID: '',
  CurrencyID: '',
  Name: '',
  Time: '',
  Rate: '',
  Tips: ''
})

const fetchOptions = async () => {
  try {
    const banksRes = await api.get('/banks')
    if (banksRes.data.code === 1) bankOptions.value = banksRes.data.data
    
    const curRes = await api.get('/currencies')
    if (curRes.data.code === 1) currencyOptions.value = curRes.data.data
  } catch (e) {
    console.error(e)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      bank_id: searchForm.bankID,
      currency_id: searchForm.currencyID
    }
    const res = await api.get('/deposits', { params })
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
  form.BankID = ''
  form.CurrencyID = ''
  form.Name = ''
  form.Time = ''
  form.Rate = ''
  form.Tips = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.ID = row.ID
  form.BankID = row.BankID
  form.CurrencyID = row.CurrencyID
  form.Name = row.Name
  form.Time = row.Time
  form.Rate = row.Rate
  form.Tips = row.Tips
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该存款记录吗?', '警告', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' })
    .then(async () => {
      try {
        await api.delete(`/deposits/${row.ID}`)
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
    const data = { 
        BankID: form.BankID, 
        CurrencyID: form.CurrencyID,
        Name: form.Name,
        Time: form.Time,
        Rate: form.Rate,
        Tips: form.Tips
    }
    let res
    if (dialogType.value === 'add') {
      res = await api.post('/deposits', data)
    } else {
      res = await api.put(`/deposits/${form.ID}`, data)
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
  fetchOptions()
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
