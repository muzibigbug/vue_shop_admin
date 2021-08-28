<template>
  <div class="common-layout">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="@/assets/logo.webp" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主题区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 侧边栏菜单区域 -->
          <div class="toggle-button" @click="toggleCollapse">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
          </div>
          <!-- default-active的值为当前路由的值 -->
          <el-menu
            :default-active="activeMenuItemId"
            :collapse="isCollapse"
            :collapse-transition="false"
            :uniqueOpened="true"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :router="true"
          >
            <el-submenu
              v-for="item in menuList"
              :key="item.id"
              :index="item.id + ''"
            >
              <template #title>
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group v-if="item.children.length > 0">
                <el-menu-item
                  v-for="childItem in item.children"
                  :key="childItem.id"
                  :index="childItem.id + ''"
                  :route="`/home/${childItem.path}`"
                  @click="saveNavState(childItem.id + '')"
                >
                  <i class="el-icon-menu"></i>
                  {{ childItem.authName }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容区域 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      menuList: [], // 左侧菜单栏数据
      iconsObj: {
        125: "icon iconfont icon-users",
        103: "icon iconfont icon-tijikongjian",
        101: "icon iconfont icon-shangpin",
        102: "icon iconfont icon-danju",
        145: "icon iconfont icon-baobiao",
      },
      isCollapse: false,
      activeMenuItemId:'', // 被激活的链接id
    };
  },
  created() {
    this.getMenuList();
    this.activeMenuItemId = sessionStorage.getItem('activeMenuItemId');
  },
  methods: {
    logout() {
      // 清空token
      sessionStorage.removeItem("userToken");
      // 跳转到登录页
      this.$router.push("/login");
      // 退出清空左侧菜单激活状态
      this.activeMenuItemId = '';
      sessionStorage.removeItem('activeMenuItemId');
    },
    // 获取所有的菜单
    getMenuList() {
      this.$axios.get("/menus").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: res.data.meta.msg
          });
        }
        this.menuList = res.data.data;
        // console.log(this.menuList);
        // this.$message({
        //   type: "success",
        //   message: "获取左侧菜单成功!",
        // });
      });
    },
    // 点击按钮,切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activeMenuItemId) {
      sessionStorage.setItem('activeMenuItemId',activeMenuItemId);
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
  },
};
</script>
<style scoped>
.common-layout,
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header div img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.el-header div span {
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
  overflow: hidden;
}
.el-menu {
  border: none;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 20px;
  line-height: 36px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>