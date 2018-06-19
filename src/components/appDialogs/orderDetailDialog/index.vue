<template>
  <el-dialog
  title="订单详情"
  :visible.sync="dialogVisible"
  custom-class="common-dialog normal-size">
  <div class="dialog-body">
    <div class="order-row app-flex app-flex-center">
      <div>订单状态：</div>
      <div class="col-1">{{detail.statusStr}}</div>
      <div>分销商订单号：</div>
      <div class="col-1">{{detail.channelOrderNo}}</div>
    </div>
    <div class="order-row app-flex app-flex-center">
      <div>订单号：</div>
      <div class="col-1">{{detail.orderNo}}</div>
      <div>价格模式：</div>
      <div class="col-1">{{detail.strategyType}}</div>
    </div>
    <div class="order-row app-flex app-flex-center">
      <div>酒店名称：</div>
      <div class="col-1">{{detail.innName}}</div>
      <div>客人姓名：</div>
      <div class="col-1">{{detail.userName}}</div>
    </div>
    <div class="order-row app-flex app-flex-center">
      <div>手机号码：</div>
      <div class="col-1">{{detail.contact}}</div>
      <div>房型：</div>
      <div class="col-1">{{detail.roomTypeName}}</div>
    </div>
    <div class="order-row app-flex app-flex-center">
      <div>分销订单总价：</div>
      <div class="col-1">{{detail.totalAmount}}</div>
      <div>预付金额：</div>
      <div class="col-1">{{detail.paidAmount}}</div>
    </div>
    <div class="order-row app-flex app-flex-center">
      <div>番茄总调价：</div>
      <div class="col-1">{{detail.extraPrice}}</div>
      <div>客户经理：</div>
      <div class="col-1">{{detail.customerManager}}</div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th width="50%">住离日期</th>
          <th width="25%">酒店单价</th>
          <th>间/夜数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, $orderIndex) in detail.channelOrderList" :key="$orderIndex">
          <td>
            {{order.checkInAt}} ~ {{order.checkOutAt}}
          </td>
          <td>
            {{order.bookPrice}}
          </td>
          <td>
            {{order.roomTypeNums}}/{{order.nightNumber}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      dialogVisible: false
    };
  },
  methods: {
    // 显示对话框
    showDialog(detailData) {
      this.initData(detailData);
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 数据初始化
    initData(data) {
      this.detail = {
        ...data,
        roomTypeName:
          data && data.channelOrderList
            ? data.channelOrderList[0].channelRoomTypeName
            : ""
      };
    }
  }
};
</script>

<style lang="less" scoped>
.order-row {
  margin-bottom: 10px;
  > * {
    &:nth-child(n) {
      width: 100px;
    }
  }
}
</style>


