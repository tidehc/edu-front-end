<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="btnDisabled"
        type="primary"
        @click="create()"
      >生成统计记录</el-button>
    </el-form>
  </div>
</template>

<script>
import daily from '@/api/statistics/daily'

export default {
  data() {
    return {
      day: '',
      btnDisabled: false
    }
  },
  methods: {
    create() {
      this.btnDisabled = true
      daily.createStatisticsByDay(this.day).then(response => {
        this.btnDisabled = false
        this.$message({
          type: 'success',
          message: '统计记录生成成功'
        })
        this.flush()
      })
    },
    flush() {
      this.day = ''
    }
  }
}
</script>
