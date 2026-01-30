<template>
  <div>
    <div class="header-actions">
      <h2>牌价管理</h2>
      <div class="search-box">
        <el-select v-model="searchForm.bankID" placeholder="选择银行" @change="handleSearch" clearable style="width: 150px; margin-right: 10px;">
          <el-option v-for="item in bankOptions" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
        <el-select v-model="searchForm.currencyID" placeholder="选择货币" @change="handleSearch" clearable style="width: 150px; margin-right: 10px;">
          <el-option v-for="item in currencyOptions" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
        <el-date-picker v-model="searchForm.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" @change="handleSearch" style="width: 150px; margin-right: 10px;" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="ID" label="ID" width="80" />
      <el-table-column prop="Date" label="日期" width="120" />
      <el-table-column label="银行">
        <template #default="scope">{{ scope.row.Bank?.Name }}</template>
      </el-table-column>
      <el-table-column label="货币">
         <template #default="scope">{{ scope.row.Currency?.Name }}</template>
      </el-table-column>
      <el-table-column prop="HuiIn" label="现汇买入" />
      <el-table-column prop="ChaoIn" label="现钞买入" />
      <el-table-column prop="HuiOut" label="现汇卖出" />
      <el-table-column prop="ChaoOut" label="现钞卖出" />
      <el-table-column prop="Zhesuan" label="中行折算" />
      <el-table-column prop="UpdatedAt" label="更新时间" width="180">
          <template #default="scope">{{ new Date(scope.row.UpdatedAt).toLocaleString() }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
        <!-- Pagination implementation if needed -->
    </div>
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

const searchForm = reactive({
  bankID: '',
  currencyID: '',
  date: ''
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
      currency_id: searchForm.currencyID,
      date: searchForm.date
    }
    const res = await api.get('/bank_rates', { params })
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

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该汇率记录吗?', '警告', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' })
    .then(async () => {
      try {
        await api.delete(`/bank_rates/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (e) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
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
