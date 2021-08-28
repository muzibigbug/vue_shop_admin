<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2. 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 100%; min-height: 400px"></div>
    </el-card>
  </div>
</template>
<script>
// 1. 导入 echarts
import * as echarts from "echarts";
import _ from "lodash";
export default {
  name: "report",
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  // dom 渲染完毕
  mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 4. 指定图表的配置项和数据
    this.$axios.get("/reports/type/1").then((res) => {
      if (res.data.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取报表失败！！",
        });
      }
      // merge(obj,obj1); 合并对象
      const result = _.merge(res.data.data, this.options);
      // 5. 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    });
  },
  methods: {},
};
</script>
<style scoped>
</style>