<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格（元）"
          width="150"
          prop="order_price"
        ></el-table-column>
        <el-table-column label="是否付款" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.pay_status == '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          width="100"
          prop="is_send"
        ></el-table-column>
        <el-table-column label="下单时间" width="200">
          <template #default="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <!-- 修改 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox(scope.row)"
              >物流</el-button
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

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="40%"
      @close="addressDialogClose('addressRef')"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressRef"
        label-width="90px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="cityDataProps"
            :clearable="true"
            expand-trigger="hover"
            :change-on-select="false"
            @change="handleChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="40%">
      <el-alert title="无订单id，静态展示..." type="warning" effect="dark">
      </el-alert>
      <div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js";
export default {
  name: "order",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 页码
        pagesize: 10, // 每页显示的条数
      },
      orderList: [],
      total: 0,
      // 控制修改地址对话框
      addressVisible: false,
      addressForm: { address1: [], address2: "" },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData,
      cityDataProps: {
        value: "value",
        label: "label",
        children: "children",
      },
      progressVisible: false,
      // 物流信息
      activities: [
        {
          color: "#0bbd87",
          size: "large",
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
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
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      this.$axios.get("/orders", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取商品失败！！",
          });
        }
        this.orderList = res.data.data.goods;
        this.total = res.data.data.total;
        // console.log(this.orderList);
      });
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val} 码`);
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    showBox(row) {
      this.addressVisible = true;
    },
    addressDialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    handleChange() {},
    showProgressBox(row) {
      // 无订单id，略.....
      //   this.$axios.get(`/kuaidi/:id`).then((res) => {
      //     console.log(res);
      //   });
      this.progressVisible = true;
    },
  },
};
</script>
<style scoped>
.el-cascader {
  width: 100%;
}
.el-timeline {
  margin-top: 20px;
}
</style>