<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房价管理</el-breadcrumb-item>
    </el-breadcrumb>
    <header v-if="roomTypeList.length">
      <el-button size="mini" type="success" @click="editSpecialPrice">
        批量设置特殊价
      </el-button>
    </header>
    <section class="marginT-10" v-if="roomTypeList.length">
      <el-alert
        title="图例说明:卖价/底价 价格展示，操作： 1､单击房型日期对应的价格可以直接设置价格  2､点击修改价格可修改单个房型的价格 3､价格生效优先级：特殊价格>周未价>默认价"
        type="warning"
        :closable="false"
        class="marginB-10 font-12">
      </el-alert>
      <drag-table
        :day-range="prevNextDayRange"
        :start-date="date"
        :date-list="dateList"
        :data-list="roomTypeList"
        display-action
        @change="dateChange">
        <template slot="left" slot-scope="scope">
          <div class="box-center text-center">
            {{scope.data.roomTypeName}}
          </div>
        </template>
        <template slot="middle-section" slot-scope="scope">
          <div class="box-center text-center">
            <el-button @click="editDefaultPrice(scope.data)" type="text">改默认价</el-button>
          </div>
        </template>
        <template slot="right-header" slot-scope="scope">
          <div class="box-center text-center">
            <header>{{scope.data.dateName}}</header>
            <section>{{scope.data.workDayName}}</section>
          </div>
        </template>
        <template slot="right-section" slot-scope="scope">
          <el-popover
            placement="top"
            width="300"
            v-model="scope.data.visible">
            <header class="font-14">
              设置特殊价
            </header>
            <section class="marginT-10">
              <div class="marginB-5 color-gray">
                {{itemCacheData.roomTypeName}}
                （{{itemCacheData.roomDate}}
                {{itemCacheData.workDayName}}）
              </div>
              <table class="table center">
                <thead>
                  <tr>
                    <th width="30%">佣金</th>
                    <th width="30%">底价</th>
                    <th>卖价</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{itemCacheData.commissionPercent}}%</td>
                    <td>{{((itemCacheData.roomPrice || 0)*(100-itemCacheData.commissionPercent)/100) | toFixed}}</td>
                    <td>
                      <el-input v-model="itemCacheData.roomPrice" class="inline" size="small" placeholder="卖价"></el-input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <footer class="marginT-10 text-right">
              <el-button size="mini" type="success" @click="saveItemSpecialPrice">
                确定
              </el-button>
              <el-button size="mini" plain @click="scope.data.visible=false">
                取消
              </el-button>
            </footer>
            <div class="item-full pointer" :class="{'editMode': scope.data.visible}" slot="reference" @click="setItemCacheData(scope.data)">
              <div class="box-center text-center">
                <header>
                  <span :class="{'color-green': scope.data.priceStatus ==1,'color-red': scope.data.priceStatus ==2}">¥{{scope.data.roomPrice}}</span>/<span class="color-commonGray">¥{{((scope.data.roomPrice || 0)*(100-scope.data.commissionPercent)/100) | toFixed}}</span>
                </header>
                <section>剩{{scope.data.roomNum}}间</section>
              </div>
            </div>
          </el-popover>
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
    <edit-default-price-dialog @refresh="getRoomTypeInfo" ref="editDefaultPriceDialog"></edit-default-price-dialog>
    <edit-special-price-dialog @refresh="getRoomTypeInfo" ref="editSpecialPriceDialog"></edit-special-price-dialog>
  </div>
</template>

<script>
import {
  DragTable,
  EditDefaultPriceDialog,
  EditSpecialPriceDialog
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
      prevNextDayRange: 20,
      itemCacheData: {},
      scopeCacheData: {}
    };
  },
  components: {
    DragTable,
    EditDefaultPriceDialog,
    EditSpecialPriceDialog
  },
  methods: {
    // 设置缓存数据
    setItemCacheData(data) {
      this.itemCacheData = { ...(this.scopeCacheData = data) };
    },
    // 获取当前时间
    getCurDate(date) {
      let now = date || new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
    // 获取页面数据
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
    // 时间切换事件
    dateChange(date) {
      this.date = date;
      this.getRoomTypeInfo();
    },
    // 点击批量设置特殊价弹窗
    editSpecialPrice() {
      this.$refs.editSpecialPriceDialog.showDialog(this.roomTypeList);
    },
    // 点击修改默认价事件
    editDefaultPrice(data) {
      this.$refs.editDefaultPriceDialog.showDialog(data);
    },
    // 保存某个房型某一天的特殊价
    saveItemSpecialPrice() {
      let vm = this;
      if (
        !this.itemCacheData.roomPrice ||
        isNaN(this.itemCacheData.roomPrice) ||
        this.itemCacheData.roomPrice <= 0
      ) {
        return this.$message.warning("输入卖价不合法！");
      }
      let param = formatter.FormatSpecialPriceData(this.itemCacheData);
      param = {
        innId: this.itemCacheData.innId,
        jsonData: JSON.stringify({ priceRecordPageVoList: [param] })
      };

      return this.$root.commonCall("setRoomTypeSpecialPrice", param, {
        success(res) {
          vm.$message.success("设置成功！");
          vm.scopeCacheData.visible = false;
          vm.scopeCacheData.roomPrice = vm.itemCacheData.roomPrice;
          vm.getRoomTypeInfo();
        },
        failMsg: "设置失败！"
      });
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
.editMode {
  background-color: #67c23a;
  color: #fff;
  transition: all 0.3s ease;
  * {
    color: #fff;
  }
}
</style>

