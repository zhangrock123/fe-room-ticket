<template>
  <el-dialog
  title="快速开关房模式"
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
              <el-radio v-model="openStatus" :label="true">
                <span class="font-12">开房</span>
              </el-radio>
              <el-radio v-model="openStatus" :label="false">
                <span class="font-12">关房</span>
              </el-radio>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div slot="footer">
    <el-button size="small" type="success" @click="submit">确认</el-button>
  </div>
</el-dialog>
</template>

<script>
import { CheckItem } from "@/components";
export default {
  props: {
    option: {
      type: Array,
      required: true
    }
  },
  components: {
    CheckItem
  },
  data() {
    return {
      optionList: this.option,
      dialogVisible: false,
      expireTime: "",
      openStatus: false
    };
  },
  methods: {
    // 显示对话框
    showDialog() {
      this.initData();
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交
    submit() {
      this.dialogVisible = false;
      console.log(this.optionList);
      console.log(this.expireTime);
    },
    // 初始化数据
    initData() {
      this.checkAll = false;
      this.expireTime = "";
      this.openStatus = false;
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

