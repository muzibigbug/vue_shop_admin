<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 权限列表区域 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template #default="scope">
            <el-tag size="mini" v-if="scope.row.level == '0'">一级标签</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.level == '1'" 
              >二级标签</el-tag
            >
            <el-tag
              size="mini"
              type="warning"
              v-else-if="scope.row.level == '2'"
              >三级标签</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "rights",
  data() {
    return {
      // 所有的权限列表
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取所有的权限列表
    getRightsList() {
      this.$axios.get("/rights/list").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "获取所有的权限列表失败！！",
          });
        }
        this.rightsList = res.data.data;
      });
    },
  },
};
</script>
<style scoped>
</style>