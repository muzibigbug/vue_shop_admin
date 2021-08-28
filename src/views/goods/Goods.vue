<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="goAddpage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          width="150"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          width="120"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template #default="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <!-- 修改 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(queryInfo.pagenum)"
        :page-size="queryInfo.pagesize"
        :page-sizes="[10, 20, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "goods",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 页码
        pagesize: 10, // 每页显示的条数
      },
      goodsList: [],
      total: 0,
    };
  },
  filters: {
    dateFormat(originVal) {
      const dt = new Date(originVal);

      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, 0);
      const hh = (dt.getHours() + "").padStart(2, 0);
      const mm = (dt.getMinutes() + "").padStart(2, 0);
      const ss = (dt.getSeconds() + "").padStart(2, 0);
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    getGoodsList() {
      this.$axios.get("/goods", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取商品失败！！",
          });
        }
        // this.$message({
        //   type: "success",
        //   message: "获取商品成功！！",
        // });
        this.goodsList = res.data.data.goods;
        this.queryInfo.pagenum = res.data.data.pagenum;
        this.total = res.data.data.total;
        // console.log(this.goodsList, this.queryInfo, this.total);
      });
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val} 码`);
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    handleEdit(i, row) {},
    handleDelete(i, row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`/goods/${row.goods_id}`).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "获取商品失败！！",
              });
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getGoodsList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goAddpage() {
        this.$router.push('/home/goods/add');
    },
  },
};
</script>
<style scoped>
</style>