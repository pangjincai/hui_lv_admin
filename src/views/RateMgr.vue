<template>
  <div>
    <div class="header-actions">
      <h2>实时汇率管理</h2>
      <div class="search-box">
        <el-select v-model="searchForm.currencyID" placeholder="选择货币" @change="handleSearch" clearable style="width: 150px; margin-right: 10px;">
          <el-option v-for="item in currencyOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker v-model="searchForm.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" @change="handleSearch" style="width: 150px; margin-right: 10px;" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="ID" label="ID" width="80" />
      <el-table-column label="货币">
         <template #default="scope">{{ scope.row.Currency?.Name }}</template>
      </el-table-column>
      <el-table-column prop="Base" label="基础货币" />
      <el-table-column prop="Rate" label="汇率" />
      <el-table-column prop="Date" label="日期" />
      <el-table-column prop="UpdatedAt" label="更新时间" width="180">
          <template #default="scope">{{ new Date(scope.row.UpdatedAt).toLocaleString() }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api'

const loading = ref(false)
const tableData = ref([])
const currencyOptions = ref([])

const searchForm = reactive({
  currencyID: '',
  date: ''
})

const fetchOptions = async () => {
  try {
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
      currency_id: searchForm.currencyID,
      date: searchForm.date
    }
    const res = await api.get('/exchange_rates', { params })
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
