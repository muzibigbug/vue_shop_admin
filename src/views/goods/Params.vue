<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关的参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            :clearable="true"
            expand-trigger="hover"
            :change-on-select="false"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="!isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <!-- 循环渲染 tag -->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="item"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template #default="scope">
                <!-- 编辑 -->
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="!isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <!-- 循环渲染 tag -->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="item"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template #default="scope">
                <!-- 编辑 -->
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose('addFormRef')"
    >
      <!-- 添加参数的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams('addFormRef')"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="`编辑${titleText}`"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose('editFormRef')"
    >
      <!-- 编辑参数的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams('editFormRef')"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "params",
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // 指定级联选择器的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑参数的表单数据对象
      editForm: {
        attr_name: "",
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制按钮与文本框的切换显示（循环出来多个会出现共享问题）
      //   inputVisible: false,
      // 文本框中输入的内容（循环出来多个会出现共享问题）
      //   inputValue: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有商品分类
    getCateList() {
      this.$axios.get("/categories").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取商品分类失败！！",
          });
        }
        this.catelist = res.data.data;
      });
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      //   console.log(this.selectedCateKeys);
      // 判断数组的长度，来决定选择的范围
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return false;
      }
      // 证明选中的是三级分类
      this.getParamsData();
    },
    // tab 页签点击事件的处理函数
    handleTabClick(tab, event) {
      this.getParamsData();
    },
    // 获取参数的列表数据
    getParamsData() {
      // 根据所选分类的id和当前所处的面板，获取对应的参数
      this.$axios
        .get(`/categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "获取参数列表失败！！",
            });
          }
          res.data.data = res.data.data.map((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            // 控制文本框的显示与隐藏（每行的不共用）
            item.inputVisible = false;
            // 文本框中输入的值（每行的不共用）
            item.inputValue = "";
            return item;
          });
          //   console.log(res.data.data);
          if (this.activeName === "many") {
            this.manyTableData = res.data.data;
          } else {
            this.onlyTableData = res.data.data;
          }
        });
    },
    // 监听添加对话框的关闭事件
    addDialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击按钮，添加参数
    addParams(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.$axios
            .post(`/categories/${this.cateId}/attributes`, {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            })
            .then((res) => {
              if (res.data.meta.status !== 201) {
                return this.$message({
                  type: "error",
                  message: "添加参数失败！！",
                });
              }
              this.$message({
                type: "success",
                message: "添加参数失败！！",
              });
              this.getParamsData();
              this.addDialogVisible = false;
            });
        }
      });
    },
    // 点击按钮，展示修改对话框
    showEditDialog(attr_id) {
      // 查询当前参数的信息
      this.$axios
        .get(`/categories/${this.cateId}/attributes/${attr_id}`, {
          params: { attr_sel: this.activeName },
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "获取参数信息失败！！",
            });
          }
          this.editForm = res.data.data;
        });
      this.editDialogVisible = true;
    },
    // 监听添加对话框的关闭事件
    editDialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    // 编辑参数
    editParams(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.$axios
            .put(
              `/categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
              {
                attr_name: this.editForm.attr_name,
                attr_sel: this.activeName,
              }
            )
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message({
                  type: "error",
                  message: "编辑参数失败！！",
                });
              }
              this.$message({
                type: "success",
                message: "编辑参数成功！！",
              });
              this.getParamsData();
              this.editDialogVisible = false;
            });
        }
      });
    },
    // 根据id删除对应的参数项
    removeParams(attrid) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`/categories/${this.cateId}/attributes/${attrid}`)
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message({
                  type: "error",
                  message: "删除参数失败！！",
                });
              }
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getParamsData();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 文本框失去焦点或摁下了 enter 键都会触发
    handleInputConfirm(row) {
      if (row.inputValue.length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      // 将输入的数据push到当前行 attr_vals 中
      row.attr_vals.push(row.inputValue);
      row.inputVisible = false;
      row.inputValue = "";
      // 需要发起请求保存
      this.saveAttrVals(row);
    },
    // 将对 attr_vals 的操作保存到数据库
    saveAttrVals(row) {
      this.$axios
        .put(`/categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "修改参数项失败！！",
            });
          }
          this.$message({
            type: "success",
            message: "修改参数项成功！！",
          });
        });
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用：当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数和选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
  computed: {
    // 如果按钮需要被禁用，则返回true；否则返回false
    isBtnDisabled() {
      return this.selectedCateKeys.length === 3;
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[this.selectedCateKeys.length - 1];
      } else {
        return null;
      }
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>
<style scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  width: 120px;
  vertical-align: bottom;
}
</style>