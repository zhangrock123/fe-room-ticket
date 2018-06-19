<template>
<div>
  <el-dialog
  title="上架房型"
  :visible.sync="dialogVisible"
  width="90%"
  :before-close="handleClose">
    <div class="dialog-body">
      <div class="open-close-box app-flex app-flex-full">
        <div class="col-1">
          <table class="table center">
            <thead>
              <tr>
                <th width="20%" rowspan="2">房型</th>
                <th width="15%" rowspan="2">绑定房型</th>
                <th width="15%" rowspan="2">价格计划</th>
                <th width="15%" rowspan="2">卖价（元）</th>
                <th>周末价</th>
              </tr>
              <tr>
                <th>
                  <div class="app-flex app-flex-center col-1">
                    <div v-for="(date, $dateIndex) in options.title" :key="$dateIndex">{{date}}</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="roomTypeData">
                <td>
                  {{roomTypeData.roomTypeName}}
                </td>
                <td>
                  <el-input @focus="selectBindRoomType" readonly prefix-icon="el-icon-search" v-model="vendorRoomTypeName" class="paddingLR-2 inline no-padding text-center" size="mini" placeholder="绑定房型"></el-input>
                </td>
                <td>
                  <el-select v-model="roomTypeData.ratePlanCode" class="paddingLR-2" clearable size="mini" placeholder="价格计划">
                    <el-option
                      v-for="(plan, $planIndex) in options.plan"
                      :key="$planIndex"
                      :label="plan.name"
                      :value="plan.id">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="roomTypeData.defaultPrice" class="paddingLR-2 inline no-padding text-center" size="mini" placeholder="卖价"></el-input>
                </td>
                <td>
                  <div class="app-flex app-flex-center col-1">
                    <div class="paddingLR-2" v-for="(data, $dataIndex) in roomTypeData.weekPrices" :key="$dataIndex">
                      <el-input v-model="data.weekSellingPrice" class="inline no-padding text-center" size="mini" placeholder=""></el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-show="!roomTypeData">
                <td colspan="7">
                  <div class="padding-10">
                    <i class="el-icon-warning"></i>
                    房型数据为空！
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button size="small" type="success" @click="confirmSubmit">确认</el-button>
    </div>
  </el-dialog>
  <select-option-dialog
    @change="checkOption"
    :column="dialog.optionColumn"
    :api-service="dialog.apiService"
    :api-param="dialog.apiParam"
    :base-param="dialog.baseParam"
    :success-expr="dialog.successExpr"
    search
    title="选择绑定房间"
    ref="selectOptionDialog">
  </select-option-dialog>
</div>

</template>

<script>
import { CheckItem, SelectOptionDialog } from "@/components";
import service from "@/service";
import formatter from "./formatter";

export default {
  props: {
    hotelInfo: {
      type: Object
    },
    roomTypeInfo: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialog: {
        optionColumn: formatter.FormatterOptionDialogColumn(),
        apiService: service.getThirdPartRoomTypeList,
        baseParam: {
          hotelId: this.hotelInfo.pmsId
        },
        successExpr: this.dialogSuccessExpr
      },
      options: {
        plan: [],
        title: "一二三四五六日".split("")
      },
      roomTypeData: {},
      vendorRoomTypeName: ""
    };
  },
  components: {
    CheckItem,
    SelectOptionDialog
  },
  computed: {},
  methods: {
    // 显示对话框
    showDialog(roomTypeData) {
      this.initPlanOption().then(() => {
        this.vendorRoomTypeName = "";
        this.roomTypeData = formatter.FormatterDefaultRoomTypeData(
          roomTypeData,
          this.hotelInfo
        );
        this.dialogVisible = true;
      });
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 上架提示确认
    confirmSubmit() {
      let checkParamStatus = formatter.CheckParamStatus(this.roomTypeData);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      this.$confirm("是否确认上架房型？", "提示", {
        type: "warning"
      }).then(res => {
        this.submit();
      });
    },
    // 确认提交
    submit() {
      let onlineParam = formatter.FormatterSubmitRoomTypeData(
        this.roomTypeData
      );
      let param = {
        innId: this.hotelInfo.fisId,
        accountId: this.hotelInfo.accountId,
        jsonData: JSON.stringify([onlineParam])
      };
      let vm = this;
      return this.$root.commonCall("onlineRoomType", param, {
        success(res) {
          vm.$message.success("房型上架成功！");
          vm.dialogVisible = false;
          vm.$emit("refresh");
        },
        failMsg: "房型上架失败！"
      });
    },
    // 初始化价格计划选项数据
    initPlanOption() {
      let vm = this;
      return this.$root.commonCall(
        "getRatePlanList",
        {
          innId: vm.hotelInfo.fisId,
          accountId: vm.hotelInfo.accountId
        },
        {
          success(res) {
            vm.options.plan = formatter.FormatterRatePlanData(res.data.list);
          },
          failMsg: "获取价格计划数据失败！"
        }
      );
    },
    // 点击弹出选择绑定第三方房型弹窗
    selectBindRoomType() {
      this.$refs.selectOptionDialog.showDialog();
    },
    // 第三方房型弹窗数据成功返回后的处理
    dialogSuccessExpr(res) {
      let options = res.data.data || [];
      if (!this.roomTypeInfo.online || !this.roomTypeInfo.online.length) {
        return options;
      }
      // 这里有个逻辑：当有已上架房型，需要排除已经被绑定的第三方房型ID
      let excludeIdList = [];
      this.roomTypeInfo.online.forEach(v => {
        excludeIdList.push(v.vendorRoomTypeId * 1);
      });
      return options.filter(v => excludeIdList.indexOf(v.roomTypeId) == -1);
    },
    // 第三方房型列表选择某个房型之后的回调方法
    checkOption(option) {
      this.roomTypeData.vendorRoomTypeId = option.roomTypeId;
      this.vendorRoomTypeName = option.roomTypeName;
    }
  },
  mounted() {}
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
</style>
