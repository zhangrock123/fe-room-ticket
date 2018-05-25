<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房量管理</el-breadcrumb-item>
    </el-breadcrumb>
    <header>
      <el-button size="mini" type="success" @click="editRoomCount">
        批量修改房量
      </el-button>
      <el-button size="mini" type="success" @click="openCloseRoom">
        批量关房
      </el-button>
    </header>
    <section class="marginT-10">
      <drag-table
        :day-range="prevNextDayRange"
        :default-date="date"
        :date-list="dateList"
        :data-list="roomTypeList"
        @change="dateChange">
        <template slot="left" slot-scope="scope">
          <div class="box-center text-center">
            {{scope.data.roomTypeName}}
          </div>
        </template>
        <template slot="right-header" slot-scope="scope">
          <div class="box-center text-center">
            <header>{{scope.data.dateName}}</header>
            <section>{{scope.data.workDayName}}</section>
          </div>
        </template>
        <template slot="right-section" slot-scope="scope">
          <div class="item-full" @click="showRight(scope.data)">
            <div class="box-center text-center" >
              <header>{{scope.data.status}}</header>
              <section>{{scope.data.count}}</section>
            </div>
          </div>
        </template>
      </drag-table>
    </section>
    <open-close-room-dialog :option="roomTypeOption" ref="openCloseRoomDialog"></open-close-room-dialog>
    <edit-room-count-dialog :data="roomCountData" ref="editRoomCountDialog"></edit-room-count-dialog>
  </div>
</template>

<script>
import {
  DragTable,
  OpenCloseRoomDialog,
  EditRoomCountDialog
} from "@/components";
import WidgetDate from "@/utils/widgetDate";
export default {
  data() {
    return {
      date: this.getCurDate(),
      dateList: [],
      roomTypeList: [],
      prevNextDayRange: 20,
      roomTypeOption: [],
      roomCountData: []
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
    testData() {
      let dateList = [];
      let curDate = this.date;
      for (let i = 0; i < this.prevNextDayRange; i++) {
        curDate = new Date(
          curDate.setTime(curDate.getTime() + 24 * 60 * 60 * 1000)
        );
        dateList.push({
          date: curDate,
          dateName: WidgetDate._dateToStr(curDate, "MM月dd日", !true),
          workDayName: WidgetDate._workDayName(curDate),
          status: Math.random() * 10 > 5 ? 1 : 0,
          count: ~~(Math.random() * 10)
        });
      }
      this.dateList = dateList;

      let roomTypeList = [];
      roomTypeList = [
        {
          roomTypeId: 1,
          roomTypeName: "豪华大床房",
          list: dateList
        },
        {
          roomTypeId: 2,
          roomTypeName: "标准间",
          list: dateList
        }
      ];
      roomTypeList = [
        ...roomTypeList,
        ...roomTypeList,
        ...roomTypeList,
        ...roomTypeList,
        ...roomTypeList,
        ...roomTypeList,
        ...roomTypeList,
        ...roomTypeList
      ];
      this.roomTypeList = roomTypeList;
      // console.log(roomTypeList);
    },
    dateChange(date) {
      console.log(date);
    },
    showRight(data) {
      console.log(">>>>", data);
    },
    openCloseRoom() {
      this.$refs.openCloseRoomDialog.showDialog();
    },
    editRoomCount() {
      this.$refs.editRoomCountDialog.showDialog();
    }
  },
  mounted() {
    this.testData();
    this.roomTypeOption = [
      {
        id: 1,
        name: "豪华大床房-(预付-无早餐)"
      },
      {
        id: 2,
        name: "标准间-(预付-无早餐)"
      }
    ];
    this.roomCountData = [
      {
        id: 1,
        name: "豪华大床房-(预付-无早餐)",
        count: 1
      },
      {
        id: 2,
        name: "标准间-(预付-无早餐)",
        count: 2
      }
    ];
  }
};
</script>

<style lang="less" scoped>
.item-full {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

