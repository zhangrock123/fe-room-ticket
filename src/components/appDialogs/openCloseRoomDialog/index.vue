<template>
  <el-dialog
  title="批量开关房"
  :visible.sync="dialogVisible"
  custom-class="common-dialog normal-size"
  :before-close="handleClose">
  <div class="dialog-body">
    <div class="open-close-box app-flex app-flex-full">
      <div>
        <check-item v-model="optionList"></check-item>
      </div>
      <div class="col-1">
        <div class="open-close-content">
          <div class="app-flex app-flex-center">
            <div class="left">生效范围</div>
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
            <div class="left">房态设置</div>
            <div class="col-1">
              <el-radio-group v-model="openStatus">
                <el-radio :label="true">
                  <span class="font-12">开房</span>
                </el-radio>
                <el-radio :label="false">
                  <span class="font-12">关房</span>
                </el-radio>
              </el-radio-group>
            </div>
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
import WidgetDate from "@/utils/widgetDate";
import { CheckItem } from "@/components";
import formatter from "./formatter";

export default {
  components: {
    CheckItem
  },
  data() {
    return {
      optionList: [],
      dialogVisible: false,
      expireTime: "",
      openStatus: false
    };
  },
  methods: {
    // 显示对话框
    showDialog(roomTypeList) {
      this.optionList = this.formatOptionList(roomTypeList);
      this.initData();
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    confirmSubmit() {
      let checkParam = {
        checkedItem: this.optionList.filter(v => v.checked) || [],
        timeRange: this.expireTime
      };
      let checkParamStatus = formatter.CheckParamStatus(checkParam);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      this.$confirm("是否确认批量开关房型？", "提示", {
        type: "warning"
      }).then(confirm => {
        let param = {
          ...checkParam,
          status: this.openStatus
        };
        this.submit(formatter.FormatSubmitData(param));
      });
    },
    // 确认提交
    submit(param) {
      let vm = this;
      return this.$root.commonCall("setRoomTypeOpenStatus", param, {
        success(res) {
          vm.$message.success("开关房操作成功！");
          vm.dialogVisible = false;
          vm.$emit("refresh");
        },
        failMsg: "开关房操作失败！"
      });
    },
    // 初始化数据
    initData() {
      this.expireTime = "";
      this.openStatus = false;
    },
    formatOptionList(list) {
      let res = [];
      if (list && list.length) {
        list.forEach(v => {
          res.push({
            ...v,
            name: v.roomTypeName,
            checked: false
          });
        });
      }
      return res;
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

