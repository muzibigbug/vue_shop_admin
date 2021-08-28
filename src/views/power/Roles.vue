<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-row
              class="vcenter"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  class="vcenter"
                  :class="[i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18" class="vcenter" style="flex-wrap: wrap">
                    <el-row v-for="item3 in item2.children" :key="item3.id">
                      <el-col>
                        <el-tag
                          type="warning"
                          closable
                          style="margin-right: 15px"
                          @close="removeRightById(scope.row, item3.id)"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="310">
          <template #default="scope">
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框区域 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClose()"
    >
      <!-- 树形结构 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "roles",
  data() {
    return {
      // 所有角色的列表
      rolesList: [],
      //  控制分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 属性控件的绑定对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中节点的id值数组
      defKeys: [],
      // 当前即将分配权限的id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      this.$axios.get("/roles").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "获取所有的角色列表失败！！",
          });
        }
        this.rolesList = res.data.data;
      });
    },
    // 根据 id 删除对应的权限
    removeRightById(role, rightId) {
      //   console.log(roleId, rightId);
      // 弹框提示用户是否删除
      this.$confirm("此操作将永久删除该角色权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message({
                  type: "删除角色权限失败！！",
                });
              }
              this.$message({
                type: "success",
                message: "删除角色权限成功!",
              });
              //   this.getRolesList();// 会导致表格局部刷新（表格会被合并）
              // 重新为当前的角色复制
              role.children = res.data.data;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 展示分配权限的对话框
    showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限数据
      this.$axios.get(`/rights/tree`).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取权限数据失败！！",
          });
        }
        this.rightslist = res.data.data;
        this.getLeafKeys(role, this.defKeys);
        this.setRightDialogVisible = true;
      });
    },
    // 通过递归的形式，获取角色下所有的三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听权限分配对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      this.$axios.post(`/roles/${this.roleId}/rights`, { rids: idStr }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "分配权限失败！！",
          });
        }
        this.$message({
          type: "success",
          message: "分配权限成功！！",
        });
        this.setRightDialogVisible = false;
      });
    },
    handleEdit() {},
  },
};
</script>
<style scoped>
.el-tag {
  margin: 8px 0;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>