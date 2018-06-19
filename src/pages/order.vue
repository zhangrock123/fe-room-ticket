<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <header>
      <el-input class="width-300 marginB-5 select-width-120" size="small" placeholder="输入关键字" v-model="searchInfo.queryValue" clearable>
        <el-select slot="prepend" size="small" v-model="searchInfo.queryType" placeholder="请选择查询类型">
          <el-option
            v-for="(typeName, typeCode) in options.queryType"
            :key="typeCode"
            :label="typeName"
            :value="typeCode">
          </el-option>
        </el-select>
      </el-input>
      <el-select class="width-150 marginB-5" clearable filterable size="small" @change="queryChannelOption(true)" v-model="searchInfo.channelId" placeholder="选择分销商">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
          v-for="(channelName, channelCode) in options.channel"
          :key="channelCode"
          :label="channelName"
          :value="channelCode">
        </el-option>
      </el-select>
      <el-select class="width-150 marginB-5" clearable filterable size="small" v-model="searchInfo.channelCode" placeholder="选择子分销商">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
          v-for="(channelName, channelCode) in options.subChannel"
          :key="channelCode"
          :label="channelName"
          :value="channelCode">
        </el-option>
      </el-select>
      <el-select class="width-150 marginB-5" clearable filterable size="small" v-model="searchInfo.status" placeholder="选择订单状态">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
          v-for="(statusName, statusCode) in options.status"
          :key="statusCode"
          :label="statusName"
          :value="statusCode">
        </el-option>
      </el-select>
      <el-select  class="width-150 marginB-5" size="small" v-model="searchInfo.orderType" placeholder="请选择日期类型">
        <el-option
          v-for="(typeName, typeCode) in options.orderType"
          :key="typeCode"
          :label="typeName"
          :value="typeCode">
        </el-option>
      </el-select>
      <el-date-picker
        class="marginB-5"
        v-model="dateRange"
        size="small"
        :editable="false"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button size="mini" type="primary" @click="search(1)">
        <i class="icon-search"></i> 查询
      </el-button>
      <el-button size="mini" type="danger" @click="resetSearch">
        <i class="icon-times-circle"></i> 重置
      </el-button>
    </header>
    <div class="text-right">
      <el-button size="mini" type="success" @click="confirmExport">
        <i class="el-icon-download"></i> 导出EXCEL
      </el-button>
      <el-button size="mini" type="warning" @click="previewHistory">
        <i class="icon-calendar"></i> 下载中心
      </el-button>
    </div>
    <section class="data-table">
      <table class="table">
        <thead>
          <tr class="pre">
            <th>分销商</th>
            <th>子分销商</th>
            <th>目的地</th>
            <th>订单状态</th>
            <th>酒店名称</th>
            <th>客户经理</th>
            <th>分销商订单号</th>
            <th>客人姓名</th>
            <th>房型</th>
            <th>房间数</th>
            <th>夜数</th>
            <th>分销商订单总价/预付金额</th>
            <th>住离日期</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr class="pre" v-show="dataList.length" v-for="(order, $orderIndex) in dataList" :key="$orderIndex">
            <td>{{order.channelName}}</td>
            <td>{{order.channelCodeName}}</td>
            <td>{{order.regionName}}</td>
            <td>{{order.statusStr}}</td>
            <td>{{order.innName}}</td>
            <td>{{order.customerManager}}</td>
            <td>{{order.channelOrderNo}}</td>
            <td>{{order.userName}}</td>
            <td>{{order.roomTypeNameStr}}</td>
            <td>{{order.roomTypeNumsStr}}</td>
            <td>{{order.nightNumberStr}}</td>
            <td>{{order.priceStr}}</td>
            <td>{{order.checkInAndOutStr}}</td>
            <td>{{order.orderTime}}</td>
            <td>
              <el-button size="mini" type="success" plain @click="viewDetail(order)">
                <span class="font-12"><i class="el-icon-info"></i> 查看详情</span>
              </el-button>
            </td>
          </tr>
          <tr v-show="!dataList.length">
            <td colspan="15">
              <div class="text-center color-gray">
                <i class="icon-exclamation-circle"></i>
                暂无数据
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <footer class="text-center">
      <el-pagination
        @current-change="search"
        @size-change="changePageSize"
        :current-page.sync="page.page"
        :page-sizes="page.sizeList"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>

    </footer>
    <order-detail-dialog ref="orderDetailDialog"></order-detail-dialog>
  </div>
</template>

<script>
import widgetDate from "@/utils/widgetDate";
import { OrderDetailDialog } from "@/components";
import formatter from "./order.formatter";

export default {
  data() {
    let now = new Date();
    return {
      // 查询条件
      searchInfo: {
        queryType: "1",
        queryValue: "",
        status: "",
        channelId: "",
        channelCode: "",
        orderType: "CREATE"
      },
      dateRange: [now, now],
      // 下拉框信息
      options: {
        queryType: [],
        channel: [],
        subChannel: [],
        status: [],
        orderType: []
      },
      // 表格数据
      dataList: [],
      // 分页信息配置
      page: {
        page: 1,
        size: 10,
        total: 1,
        sizeList: [5, 10, 15, 20]
      }
    };
  },
  components: {
    OrderDetailDialog
  },
  methods: {
    // 查询数据
    search(page) {
      this.page.page = page || 1;
      this.getListData();
    },
    // 分页条数改变事件
    changePageSize(size) {
      this.page.size = size || 10;
      this.getListData();
    },
    // 重置查询条件
    resetSearch() {
      let now = new Date();
      this.searchInfo = {
        queryType: "1",
        queryValue: "",
        status: "",
        channelId: "",
        channelCode: "",
        orderType: "CREATE"
      };
      this.dateRange = [now, now];
      this.page.page = 1;
      this.page.total = 1;
      this.getListData();
    },
    // 获取表格数据
    getListData() {
      let vm = this;
      let params = {
        ...this.searchInfo,
        startDate: widgetDate._dateToStr(this.dateRange[0]),
        endDate: widgetDate._dateToStr(this.dateRange[1]),
        pageNo: this.page.page,
        pageSize: this.page.size
      };
      return this.$root.commonCall("getOrderList", params, {
        success(res) {
          vm.dataList = res.data.data.list || [];
          vm.page.total = res.data.data.pageManager.rowsCount || 0;
        }
      });
    },
    // 获取分销商／子分销商选项数据
    queryChannelOption(isSubChannel = false) {
      let vm = this;
      let settings = {
        serviceName: isSubChannel ? "getSubChannelList" : "getChannelList",
        defaultFailMsg: isSubChannel
          ? "获取子分销商列表失败！"
          : "获取代销分销商列表失败！",
        param: isSubChannel ? { channelId: this.searchInfo.channelId } : {},
        optionColumn: isSubChannel ? "subChannel" : "channel"
      };
      isSubChannel &&
        (this.options.subChannel = []) &&
        (this.searchInfo.channelCode = "");

      if (isSubChannel && !this.searchInfo.channelId) {
        return Promise.resolve();
      }

      return this.$root.commonCall(settings.serviceName, settings.param, {
        success(res) {
          vm.options[settings.optionColumn] = res.data.data;
        },
        failMsg: settings.defaultFailMsg
      });
    },
    // 确认导出文档
    confirmExport() {
      if (!this.page.total) {
        return this.$message.warning("查询数据为空，导出无效！");
      }
      this.$confirm("是否确认导出？", "提示", {
        type: "warning"
      }).then(confirm => {
        return this.exportExcel();
      });
    },
    // 执行导出文档
    exportExcel() {
      let vm = this;
      let params = {
        ...this.searchInfo,
        startDate: widgetDate._dateToStr(this.dateRange[0]),
        endDate: widgetDate._dateToStr(this.dateRange[1])
      };
      return this.$root.commonCall("exportOrder", params, {
        success(res) {
          vm.$message.success("导出成功，请至“下载中心”下载相应文档！");
        },
        failMsg: "导出失败！"
      });
    },
    // 跳转下载中心
    previewHistory() {
      this.$router.push({
        name: "orderHistory"
      });
    },
    // 查看订单详情
    viewDetail(data) {
      this.$refs.orderDetailDialog.showDialog(data);
    }
  },
  mounted() {
    this.$loading.open();
    this.queryChannelOption(false)
      .then(res => {
        this.options.status = formatter.OrderStatusOptionConfig();
        this.options.orderType = formatter.OrderTypeOptionConfig();
        this.options.queryType = formatter.QueryTypeOptionConfig();
        this.getListData();
      })
      .finally(() => {
        this.$loading.close();
      });
  }
};
</script>

<style lang="less" scoped>
.data-table {
  margin: 10px 0;
  overflow: scroll;
  .pre {
    white-space: pre;
  }
}
</style>
