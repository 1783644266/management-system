<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script >
import * as echarts from 'echarts';
import merge from 'lodash/merge'

export default {
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'));
    const {data} = await this.$http.get('reports/type/1')
    const a = merge(this.options, data.data)
     myChart.setOption(a);
  },
  data() {
    return {
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  methods: {
    getData() {

    }
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>