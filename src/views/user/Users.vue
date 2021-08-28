<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template #default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
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
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current_page"
        :page-sizes="pagination.page_sizes"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose('addFormRef')"
    >
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('addFormRef')"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="addDialogClose('editFormRef')"
    >
      <!-- 表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名称">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser('editFormRef')"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="setRoleDialogCLose"
    >
      <div>
        <p style="margin-bottom: 22px">当前的用户：{{ userInfo.username }}</p>
        <p style="margin-bottom: 22px">当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "users",
  data() {
    // 自定义邮箱校验规则
    var validateEmail = (rule, value, callback) => {
      const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!reg.test(value)) {
        callback(new Error("邮箱格式不正确!!"));
      } else {
        // 合法邮箱
        return callback();
      }
    };
    // 自定义手机号校验规则
    var validateMobile = (rule, value, callback) => {
      const reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式不正确!!"));
      } else {
        // 合法手机号
        return callback();
      }
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 当前页码
        pagesize: 2, // 每页显示条数
      },
      userlist: [],
      mg_state: true,
      pagination: {
        page_sizes: [1, 2, 4, 10], // 显示页数选项
        total: 0, // 总页数
      },
      addDialogVisible: false, // 控制添加用对话框的显示与隐藏
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的表单数据验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户民", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "用户名的长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      //  控制修改用户对话框显示隐藏
      editDialogVisible: false,
      //  查询到的用户信息
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //  获取用户列表
    getUserList() {
      this.$axios.get("/users", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: res.data.meta.msg,
          });
        }
        this.userlist = res.data.data.users;
        this.pagination.total = res.data.data.total;
      });
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val} 码`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    // 监听 switch 开关状态的改变
    userStateChange(user) {
      //   console.log(user);
      this.$axios
        .put(`/users/${user.id}/state/${user.mg_state}`)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message({
              type: "error",
              message: res.data.meta.message,
            });
          }
          this.getUserList();
        });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose(fromName) {
      this.$refs[fromName].resetFields();
    },
    // 添加用户
    addUser(fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          // 可以发起用户的网络请求
          this.$axios.post("/users", this.addForm).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 201) {
              return this.$message({
                type: "error",
                message: "添加用户失败!!",
              });
            }
            this.$message({
              type: "success",
              message: "添加用户成功!!",
            });
            // 隐藏添加用户对话框
            this.addDialogVisible = false;
            this.getUserList();
          });
        }
      });
    },
    // 编辑用户的对话框
    handleEdit(index, row) {
      //   console.log(index, row.id);
      this.$axios.get(`/users/${row.id}`).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "查询当前用户信息失败!!",
          });
        }
        this.editForm = res.data.data;
        this.editDialogVisible = true;
      });
    },
    // 修改用户信息并提交
    editUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }
        // 发起用户的修改请求
        this.$axios
          .put(`/users/${this.editForm.id}`, this.editForm)
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "修改用户失败!!",
              });
            }
            this.$message({
              type: "success",
              message: "修改用户成功!!",
            });
            // 关闭对话框
            this.editDialogVisible = false;
            this.getUserList();
          });
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`/users/${row.id}`, { id: row.id }).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "删除用户失败!!",
              });
            }
            this.$message({
              type: "success",
              message: "删除用户成功!!",
            });
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配角色按钮
    setRole(index, row) {
      this.userInfo = row;
      //  在展示对话框之前，获取所有的角色列表
      this.$axios.get("/roles").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "删除用户失败!!",
          });
        }
        this.rolesList = res.data.data;
      });
      this.setRoleDialogVisible = true;
    },
    // 点击按钮分配角色
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message({
          type: "error",
          message: "请选择用户的角色!!",
        });
      }
      this.$axios
        .put(`/users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "更新角色失败!!",
            });
          }
          this.$message({
            type: "success",
            message: "更新角色成功!!",
          });
          this.getUserList();
          this.setRoleDialogVisible = false;
        });
    },
    // 监听分配角色对话框的关闭信息
    setRoleDialogCLose() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
  },
};
</script>
<style scoped>
</style>