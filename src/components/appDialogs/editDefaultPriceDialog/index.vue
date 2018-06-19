<template>
   <el-dialog
    title="编辑默认价"
    :visible.sync="dialogVisible"
    custom-class="common-dialog normal-size"
    :before-close="handleClose">
    <div class="dialog-body">
      <header>
        {{roomTypeData.roomTypeName}}
      </header>
      <section class="marginB-10">
        <div class="app-flex app-flex-center">
          <div class="width-100">
            增加周末价
          </div>
          <div class="col-1">
            <el-radio v-model="isAddWeekendPrice" :label="true">
              <span class="font-12">是</span>
            </el-radio>
            <el-radio v-model="isAddWeekendPrice" :label="false">
              <span class="font-12">否</span>
            </el-radio>
          </div>
        </div>
      </section>
      <section class="marginB-10 week-setting-box" v-show="isAddWeekendPrice">
        <div class="app-flex app-flex-center">
          <div>
            <ul class="week-box">
              <li>【 </li>
              <li v-for="(week, $weekIndex) in weekendList" :key="$weekIndex">
                <el-checkbox v-model="week.checked" @change="changeListPrices">
                  <div class="font-12">{{week.name}}</div>
                </el-checkbox>
              </li>
              <li>】</li>
            </ul>
          </div>
          <div class="paddingL-5">
            <el-checkbox v-model="isUnionSetWeek" @change="changeListPrices">
              <div class="font-12">统一设置周末价</div>
            </el-checkbox>
          </div>
        </div>

      </section>
      <section>
        <table class="table center">
          <thead>
            <tr>
              <th width="25%">价格类型</th>
              <th width="10%">佣金</th>
              <th width="30%">底价(元／间夜)</th>
              <th>卖价(元／间夜)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{normalPrice.name}}</td>
              <td>{{roomTypeData.commissionPercent}}%</td>
              <td>
                {{((normalPrice.salePrice || 0)*(100-roomTypeData.commissionPercent)/100) | toFixed}}
              </td>
              <td>
                <el-input class="inline" size="small" v-model="normalPrice.salePrice" placeholder="请输入价格"></el-input>
              </td>
            </tr>
            <tr v-show="isAddWeekendPrice" v-for="(option, $optionIndex) in listPrices" :key="$optionIndex">
              <td>{{option.name}}</td>
              <td>{{roomTypeData.commissionPercent}}%</td>
              <td>
                {{((option.salePrice || 0)*(100-roomTypeData.commissionPercent)/100) | toFixed}}
              </td>
              <td>
                <el-input class="inline" size="small" v-model="option.salePrice" placeholder="请输入价格"></el-input>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <div slot="footer">
      <el-button size="small" type="success" @click="confirmSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import formatter from "./formatter";

export default {
  data() {
    return {
      dialogVisible: false,
      roomTypeData: {},
      isAddWeekendPrice: false,
      weekendList: [],
      isUnionSetWeek: false,
      normalPrice: {},
      listPrices: [],
      cachedInputPrices: {},
      recordInfo: {}
    };
  },
  methods: {
    // 动态添加／移除表格数据
    changeListPrices(priceList) {
      let priceItems = [];
      if (this.isUnionSetWeek) {
        priceItems = [
          {
            id: 99,
            name: "周末",
            salePrice: ""
          }
        ];
      } else {
        let weekendList = [];
        let defPrice = 0;
        let weekInitialPrice = null;
        weekendList = [...this.weekendList.filter(v => v.checked)];
        weekendList.forEach(v => {
          defPrice =
            (this.listPrices.filter(m => m.id == v.id)[0] || {}).salePrice ||
            "";
          weekInitialPrice = null;
          priceList &&
            priceList.length &&
            priceList.some(m => {
              if (m.weekDate * 1 == v.id) {
                defPrice = m.weekSellingPrice;
                weekInitialPrice = m.weekInitialPrice;
                return true;
              }
            });
          priceItems.push({
            id: v.id,
            name: v.name,
            salePrice: defPrice,
            weekInitialPrice
          });
        });
      }
      this.listPrices = priceItems;
    },
    // 显示对话框
    showDialog(roomTypeData) {
      this.roomTypeData = { ...roomTypeData };
      this.getPriceRecord().then(() => {
        this.initWeekendList(this.recordInfo.weekPrices || null);
        this.initData();
        this.dialogVisible = true;
      });
    },
    // 初始化数据
    initData() {
      this.isAddWeekendPrice = false;
      this.isUnionSetWeek = false;
      this.listPrices = [];
      this.normalPrice = {
        id: 0,
        name: "平时",
        salePrice: this.roomTypeData.sellingPrice || ""
      };
      if (!this.recordInfo || !this.recordInfo.otaRoomTypeId) {
        return;
      }
      this.normalPrice.salePrice = this.recordInfo.defaultPrice;
      this.recordInfo.weekPrices &&
        this.recordInfo.weekPrices.length &&
        (this.isAddWeekendPrice = true);
      this.changeListPrices(this.recordInfo.weekPrices || null);
    },
    getPriceRecord() {
      let vm = this;
      return this.$root.commonCall(
        "getRoomTypePriceRecord",
        {
          innId: vm.roomTypeData.innId,
          otaRoomTypeId: vm.roomTypeData.otaRoomTypeId
        },
        {
          success(res) {
            vm.recordInfo = res.data.data ? res.data.data[0] : {};
          },
          failMsg: "获取初始数据失败！"
        }
      );
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 提示是否保存
    confirmSubmit() {
      let checkParam = {
        normalPrice: this.normalPrice,
        listPrices: this.listPrices,
        isAddWeekendPrice: this.isAddWeekendPrice,
        isUnionSetWeek: this.isUnionSetWeek,
        roomTypeData: this.roomTypeData,
        weekendList: this.weekendList
      };
      let checkParamStatus = formatter.CheckParamStatus(checkParam);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      this.$confirm("是否确认保存？", "提示", {
        type: "warning"
      }).then(confirm => {
        this.submit(
          formatter.FormatSubmitData(
            checkParam,
            this.recordInfo.weekPrices || []
          )
        );
      });
    },
    // 确认提交
    submit(param) {
      param = {
        accountId: this.roomTypeData.accountId,
        innId: this.roomTypeData.innId,
        jsonData: JSON.stringify([param])
      };
      let vm = this;
      return this.$root.commonCall("setRoomTypeDefaultPrice", param, {
        success(res) {
          vm.$message.success("设置成功！");
          vm.dialogVisible = false;
          vm.$emit("refresh");
        },
        failMsg: "设置失败！"
      });
    },
    // 初始化星期数据
    initWeekendList(priceList) {
      let weekendList = [];
      let checked = false;
      "一二三四五六日".split("").forEach((v, i) => {
        checked = false;
        priceList &&
          priceList.length &&
          priceList.some(m => {
            if (m.weekDate * 1 == i + 1) {
              return (checked = true);
            }
          });
        weekendList.push({
          id: i + 1,
          name: `周${v}`,
          checked
        });
      });
      this.weekendList = weekendList;
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-body {
  min-height: 200px;
  > header {
    border-bottom: 1px dashed #ccc;
    font-size: 14px;
    padding: 5px 0;
    margin-bottom: 10px;
  }
  .week-setting-box {
    background-color: #eee;
    border: 1px dotted #ccc;
    padding: 5px 10px;
    position: relative;
    transition: all 0.3s ease;
    &:before {
      content: "";
      display: block;
      position: absolute;
      left: 100px;
      top: -6px;
      width: 8px;
      height: 8px;
      background-color: #eee;
      border-left: 1px dotted #ccc;
      border-top: 1px dotted #ccc;
      transform: rotate(45deg);
    }
    .week-box {
      li {
        display: inline-block;
        margin-right: 8px;
      }
    }
  }
}
</style>
