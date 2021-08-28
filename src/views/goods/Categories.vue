<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        border
        stripe
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            :class="scope.row.cat_deleted ? 'el-icon-success' : 'el-icon-error'"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == '1'"
            >二级</el-tag
          >
          <el-tag
            size="mini"
            type="warning"
            v-else-if="scope.row.cat_level == '2'"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <!-- 编辑 -->
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <!-- 删除 -->
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current_page"
          :page-sizes="[5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClose('addCateRef')"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            :clearable="true"
            expand-trigger="hover"
            :change-on-select="false"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate('addCateRef')"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "categories",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1, // 当前页
        pagesize: 5, // 每页显示多少条
      },
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      // 为 table 指定列的定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          // 将当前列指定为模板列
          type: "template",
          // 当前这一列的模板名称
          template: "isok",
        },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt", width: "200px" },
      ],
      // 控制添加分类对话框
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0, // 父级分类的id
        cat_level: 0, // 分类等级,默认一级
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的id值，必须是数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    // 获取商品分类
    getCategories() {
      this.$axios.get("/categories", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取商品分类失败！！",
          });
        }
        this.catelist = res.data.data.result;
        this.total = res.data.data.total;
        // console.log(this.catelist);
      });
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getCategories();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val} 码`);
      this.queryInfo.pagenum = val;
      this.getCategories();
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    getParentCateList() {
      this.$axios.get("/categories", { params: { type: 2 } }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取父级分类数据失败！！",
          });
        }
        this.parentCateList = res.data.data;
      });
    },
    // 选择项发生变化触发
    parentCateChange() {
      /* 
            如果 selectedKeys 数组中的 length 大于0，证明选中了父级分类；反之，则没选中父级分类
        */
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      }
      this.addCateForm.cat_pid = 0;
      // 当前分类的等级赋值
      this.addCateForm.cat_level = 0;
    },
    // 点击按钮添加新的分类
    addCate(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.$axios.post("/categories", this.addCateForm).then((res) => {
            if (res.data.meta.status !== 201) {
              return this.$message({
                type: "error",
                message: "添加分类失败！！",
              });
            }
            console.log(res);
            this.$message({
              type: "success",
              message: "添加分类成功！！",
            });
            this.getCategories();
            this.addCateDialogVisible = false;
          });
        }
      });
    },
    // 监听对话框的关闭处理函数
    addCateDialogClose(formName) {
      this.$refs[formName].resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
  },
};
</script>
<style scoped>
.el-icon-success {
  color: lightgreen;
  font-size: 14px;
}
.el-icon-error {
  color: red;
  font-size: 14px;
}
.el-cascader {
  width: 100%;
}
</style>