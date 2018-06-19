<template>
  <el-dialog
  title="批量设置特殊价"
  :visible.sync="dialogVisible"
  custom-class="common-dialog normal-size"
  :before-close="handleClose">
  <div class="dialog-body">
    <div class="open-close-box app-flex app-flex-full">
      <div>
        <check-item @change="changeCheckedRoomType" v-model="optionList"></check-item>
      </div>
      <div class="col-1">
        <div class="open-close-content">
          <div class="app-flex app-flex-center">
            <div class="left">时间范围</div>
            <div class="col-1">
              <el-date-picker
                v-model="expireTime"
                class="no-padding inline"
                type="daterange"
                :editable="false"
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="app-flex app-flex-center">
            <div class="left">适用星期</div>
            <div class="col-1">
              <check-week-item :checked-list="checkedWeeks" @change="changeWeekItem"></check-week-item>
            </div>
          </div>
          <div>
            <table class="table center">
              <thead>
                <tr>
                  <th width="35%">房型&售卖规则</th>
                  <th width="10%">佣金</th>
                  <th width="25%">底价</th>
                  <th>卖价</th>
                </tr>
              </thead>
              <tbody v-if="checkedRoomTypes.length">
                <tr v-for="(option, index) in checkedRoomTypes" :key="index">
                  <td>{{option.name}}</td>
                  <td>{{option.commissionPercent}}%</td>
                  <td>
                    {{((option.salePrice || 0)*(100-option.commissionPercent)/100) | toFixed}}
                  </td>
                  <td>
                    <el-input class="inline marginLR-5" size="small" v-model="checkedRoomTypes[index].salePrice" placeholder="请输入价格"></el-input>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4">请选择房型！</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div slot="footer">
    <el-button size="small" type="success" @click="confirmSubmit">确认</el-button>
  </div>
</el-dialog>
</template>

<script>
import { CheckItem, CheckWeekItem } from "@/components";
import formatter from "./formatter";

export default {
  components: {
    CheckItem,
    CheckWeekItem
  },
  data() {
    return {
      optionList: [],
      dialogVisible: false,
      expireTime: "",
      weekOptionList: [],
      checkedRoomTypes: [],
      checkedWeeks: []
    };
  },
  methods: {
    // 确认选择／取消选择房型，动态添加／移除表格房型项数据
    changeCheckedRoomType(roomType) {
      let res = [];
      roomType.forEach(v => {
        res.push({
          ...v,
          salePrice:
            (
              this.checkedRoomTypes.filter(
                m => m.roomTypeId == v.roomTypeId
              )[0] || {}
            ).salePrice || ""
        });
      });
      this.checkedRoomTypes = res;
    },
    // 显示对话框
    showDialog(roomTypeList) {
      this.initOptions(roomTypeList);
      this.initData();
      this.dialogVisible = true;
    },
    // 初始化房型选项数据
    initOptions(data) {
      let res = [];
      if (data && data.length) {
        data.forEach(v => {
          res.push({
            ...v,
            name: v.roomTypeName,
            checked: false
          });
        });
      }
      this.optionList = res;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交提示
    confirmSubmit() {
      let checkParam = {
        checkedItem: this.checkedRoomTypes,
        timeRange: this.expireTime,
        week: this.weekOptionList
      };
      let checkParamStatus = formatter.CheckParamStatus(checkParam);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      this.$confirm("是否确认保存？", "提示", {
        type: "warning"
      }).then(confirm => {
        this.submit(formatter.FormatSubmitData(checkParam));
      });
    },
    // 确认提交
    submit(param) {
      param = {
        innId: this.optionList[0].innId,
        jsonData: JSON.stringify({ priceRecordPageVoList: [param] })
      };
      let vm = this;
      return this.$root.commonCall("setRoomTypeSpecialPrice", param, {
        success(res) {
          vm.$message.success("设置成功！");
          vm.dialogVisible = false;
          vm.$emit("refresh");
        },
        failMsg: "设置失败！"
      });
    },
    // 初始化数据
    initData() {
      this.expireTime = "";
      this.checkedRoomTypes = [];
      this.checkedWeeks = [1, 2, 3, 4, 5, 6, 7];
    },
    // 星期选择回调更新数据
    changeWeekItem(v) {
      this.weekOptionList = v;
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-body {
  min-height: 200px;
  border: 1px solid #eee;
  .open-close-box {
    min-height: inherit;
    > * {
      padding: 10px;
      + * {
        border-left: 1px solid #eee;
      }
    }
  }
}
.open-close-content {
  > * {
    margin-bottom: 15px;
  }
  .left {
    font-size: 12px;
    width: 80px;
  }
}
</style>

