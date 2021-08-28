<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头部区域 -->
      <div class="avatar_box">
        <img src="@/assets/avatar.jpg" alt="" srcset="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm login_form"
      >
        <el-form-item prop="username">
          <!-- prefix-icon: 元素前面添加图标；suffix-icon: 后面添加图标 -->
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
            prefix-icon="icon iconfont icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
            prefix-icon="icon iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        admin/123456
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空！", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "用户名长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/login", this.loginForm).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "登录失败！",
              });
            }
            this.$message({
              type: "success",
              message: "登录成功！",
            });
            let { id, username, email, mobile, token } = res.data.data;
            /* 
                1. 将登录成功后的 token，保存到客户端 sessionStorage 中
                    1.1 项目中出了登录之外的其他api接口，必须在登录之后才能访问
                    1.2 token 只应在当前网站打开期间生效，所以将token 保存在 sessionStorage 中
            */
            sessionStorage.setItem("userToken", token);
            // 2. 使用编程式导航，跳转到后台主页 /home 
            this.$router.push("/home");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style scoped>
.login_container {
  background: #2b466b;
  width: 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  min-height: 200px;
  padding: 0 20px 20px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box img {
  width: 100%;
  background-color: #eee;
}
.login_form {
  padding-top: 85px;
}
.btns {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 0;
}
</style>