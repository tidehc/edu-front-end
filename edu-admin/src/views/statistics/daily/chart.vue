<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <el-option label="学员登陆数统计" value="login_num"/>
          <el-option label="学员注册数统计" value="register_num"/>
          <el-option label="课程播放数统计" value="video_view_num"/>
          <el-option label="每日课程数统计" value="course_num"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询</el-button>

      <el-button
        type="default"
        icon="el-icon-delete"
        @click="resetData()">
        重置</el-button>

    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import daily from '@/api/statistics/daily'

export default {
  data() {
    return {
      searchObj: {// 查询对象
        type: '',
        begin: '',
        end: ''
      },
      btnDisabled: false, // 按钮是否禁用
      chart: null,
      title: '',
      xData: [],
      yData: []
    }
  },
  methods: {
    showChart() { // 展示图表
      this.initCharData()// 拉取图表数据
    },
    initCharData() {
      daily.getChartData(this.searchObj).then(response => {
        // 数据
        this.yData = response.data.dataList
        // 横轴时间
        this.xData = response.data.dateList

        // 当前统计类别
        switch (this.searchObj.type) {
          case 'register_num':
            this.title = '学员注册数统计'
            break
          case 'login_num':
            this.title = '学员登录数统计'
            break
          case 'video_view_num':
            this.title = '课程播放数统计'
            break
          case 'course_num':
            this.title = '每日课程数统计'
            break
        }

        this.setChartData()// 设置图表参数
      })
    },
    setChartData() {
      // 基于准备好的dom,初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'), 'light')

      // 指定图表的配置项和数据
      var option = {

        title: {
          text: this.title
        },
        // x轴是类目轴,通过data设置类目数据
        xAxis: {
          type: 'category',
          data: this.xData
        },
        // y轴是数据轴
        yAxis: {
          type: 'value'
        },
        // 系列列表, 每个系列通过type决定自己的图表类型
        series: [{
          // 折线图
          type: 'line',
          // 系列中的数据内容数组
          data: this.yData
        }, {
          type: 'bar',
          data: this.yData
        }],

        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        },
        {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }]
      }

      // 使用刚指定的配置项和数据显示图表
      this.chart.setOption(option)
    },
    resetData() {
      window.location.reload()
    }

  }
}
</script>
