<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房量管理</el-breadcrumb-item>
    </el-breadcrumb>
    <header v-if="roomTypeList.length">
      <el-button size="mini" type="success" @click="multipleOpenCloseRoom">
        批量开关房
      </el-button>
    </header>
    <section class="marginT-10" v-if="roomTypeList.length">
      <el-alert
        title="说明：格子中的数字或文字为剩余房量或售卖状态 操作：1､单击房型日期对应的格子可以直接开关房 2､点击批量开关房可一次性修改多间房销售状态"
        type="warning"
        :closable="false"
        class="marginB-10 font-12">
      </el-alert>
      <drag-table
        :day-range="prevNextDayRange"
        :start-date="date"
        :date-list="dateList"
        :data-list="roomTypeList"
        action-title="修改房券"
        display-action
        @change="dateChange">
        <template slot="left" slot-scope="scope">
          <div class="box-center text-center">
            {{scope.data.roomTypeName}}
          </div>
        </template>
        <template slot="middle-section" slot-scope="scope">
          <div class="item-full pointer" @click="editRoomCount(scope.data)">
            <div class="box-center text-center">
              <el-button type="text">{{scope.data.ticketNumber || 0}}</el-button>
            </div>
          </div>
        </template>
        <template slot="right-header" slot-scope="scope">
          <div class="box-center text-center">
            <header>{{scope.data.dateName}}</header>
            <section>{{scope.data.workDayName}}</section>
          </div>
        </template>
        <template slot="right-section" slot-scope="scope">
          <div class="item-full pointer" :class="{'status-stop': scope.data.statusValue==1 || scope.data.statusValue==3, 'status-no-sale': scope.data.statusValue==2}" @click="openCloseRoom(scope.data)">
            <div class="box-center text-center" >
              {{scope.data.statusLabel || scope.data.roomNum}}
            </div>
          </div>
        </template>
      </drag-table>
    </section>
    <section class="marginT-10" v-else>
      <el-alert
        title="暂无房型信息！"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>
    </section>
    <open-close-room-dialog @refresh="getRoomTypeInfo" ref="openCloseRoomDialog"></open-close-room-dialog>
    <edit-room-count-dialog @reset="setRoomTypeTicketNumber" ref="editRoomCountDialog"></edit-room-count-dialog>
  </div>
</template>

<script>
import {
  DragTable,
  OpenCloseRoomDialog,
  EditRoomCountDialog
} from "@/components";
import WidgetDate from "@/utils/widgetDate";
import formatter from "./roomCount.formatter";

export default {
  data() {
    return {
      innId: "",
      accountId: "",
      date: null,
      dateList: [],
      roomTypeList: [],
      prevNextDayRange: 20
    };
  },
  components: {
    DragTable,
    OpenCloseRoomDialog,
    EditRoomCountDialog
  },
  methods: {
    getCurDate(date) {
      let now = date || new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
    getRoomTypeInfo() {
      let vm = this;
      let tarDate = new Date(
        this.date.getTime() + 24 * 60 * 60 * 1000 * this.prevNextDayRange
      );
      let param = {
        innId: this.innId,
        accountId: this.accountId,
        from: WidgetDate._dateToStr(this.date, "yyyy-MM-dd", true),
        to: WidgetDate._dateToStr(tarDate, "yyyy-MM-dd", true)
      };
      return this.$root.commonCall("getRoomTypeInfo", param, {
        success(res) {
          let formatData = formatter.FormatRoomTypeData(res.data.list);
          vm.roomTypeList = formatData.data;
          vm.dateList = formatData.date;
        },
        failMsg: "获取房型数据失败！"
      });
    },
    dateChange(date) {
      this.date = date;
      this.getRoomTypeInfo();
    },
    openCloseRoom(data) {
      let vm = this;
      let param = formatter.FormatSingleRoomOpenCloseData(data);
      return this.$root.commonCall("setRoomTypeOpenStatus", param, {
        success(res) {
          vm.$message.success("开关房操作成功！");
          vm.getRoomTypeInfo();
        },
        failMsg: "开关房操作失败！"
      });
    },
    multipleOpenCloseRoom() {
      this.$refs.openCloseRoomDialog.showDialog(this.roomTypeList);
    },
    editRoomCount(data) {
      this.$refs.editRoomCountDialog.showDialog(data);
    },
    // 更改完房券回调，改写房型的房券数量
    setRoomTypeTicketNumber(data) {
      if (this.roomTypeList && this.roomTypeList.length) {
        this.roomTypeList.some(v => {
          if (v.roomTypeId == data.roomTypeId) {
            v.ticketNumber = data.count;
            return true;
          }
        });
      }
    }
  },
  beforeMount() {
    this.date = this.getCurDate();
    this.innId = this.$route.params.innId;
    this.accountId = this.$route.params.accountId;
  },
  mounted() {
    this.getRoomTypeInfo();
  }
};
</script>

<style lang="less" scoped>
.item-full {
  width: 100%;
  height: 100%;
  position: relative;
}
.status-stop {
  background-color: #f39c9c;
  transition: all 0.3s ease;
}
.status-no-sale {
  background-color: #eee;
  &:hover {
    background-color: #fdf5e6;
  }
}
</style>

