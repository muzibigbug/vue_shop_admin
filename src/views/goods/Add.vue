<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRules"
        label-position="top"
      >
        <!-- tabs 标签页区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                :clearable="true"
                expand-trigger="hover"
                :change-on-select="false"
                @change="handleChange"
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="item1 in item.attr_vals"
                  :key="item1"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传区域 -->
            <el-upload
              :action="uploadURL"
              :headers="uploadHeadersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button
              type="primary"
              class="btn_add"
              @click="add('addFormRules')"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览弹出对话框 -->
    <el-dialog title="提示" :visible.sync="previewVisible" width="40%">
      <img :src="previewPath" class="preview_img" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "add",
  data() {
    return {
      // 步骤条进度索引
      activeIndex: 0,
      // 添加商品的数据对象
      addForm: {
        goods_name: "",
        goods_price: 10,
        goods_weight: 10,
        goods_number: 10,
        // 选中的商品分类的id值，必须是数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品内容
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品分类列表
      catelist: [],
      // 指定级联选择器的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 上传图片的url地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 设置上传图片的请求头（token）
      uploadHeadersObj: {
        Authorization: sessionStorage.getItem("userToken"),
      },
      // 上传图片后的真实路径
      previewPath: "",
      // 控制图片预览对话框
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
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
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message({
          type: "error",
          message: "请先选择商品分类",
        });
        this.activeIndex = oldActiveName;
        return false;
      }
    },
    tabClick() {
      if (this.activeIndex == 1) {
        this.$axios
          .get(`/categories/${this.cateId}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "获取动态参数列表失败！！",
              });
            }
            res.data.data = res.data.data.map((item) => {
              item.attr_vals = item.attr_vals.split(" ");
              return item;
            });
            this.manyTableData = res.data.data;
          });
      } else if (this.activeIndex == 2) {
        this.$axios
          .get(`/categories/${this.cateId}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "获取静态属性列表失败！！",
              });
            }

            this.onlyTableData = res.data.data;
            console.log(this.onlyTableData);
          });
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      //   console.log(response);
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2. 将图片信息对象，push 到 pics 数组中
      this.addForm.pics.push(picInfo);
      //   console.log(this.addForm.pics);
    },
    // 处理移除图片的操作
    handleRemove(file) {
      //   console.log(file);
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((item) => {
        item.pic === filePath;
      });
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1);
      //   console.log(this.addForm.pics);
    },
    // 添加商品
    add(formName) {
      //   console.log(this.addForm);
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return this.$message({
            type: "error",
            message: "请填写必要的表单项！！",
          });
        }
        // 执行添加业务逻辑
        // lodash   cloneDeep()深拷贝
        let form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态参数
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        
          console.log(form);
        this.$axios.post("/goods", form).then((res) => {
          if (res.data.meta.status !== 201) {
            return this.$message({
              type: "error",
              message: "添加商品失败！！",
            });
          }
          this.$message({
            type: "success",
            message: "添加商品成功！！",
          });
          this.$router.push("/home/goods");
        });
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin-right: 15px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
.preview_img {
  width: 100%;
}
.btn_add {
  margin-top: 15px;
  float: right;
  overflow: hidden;
}
</style>