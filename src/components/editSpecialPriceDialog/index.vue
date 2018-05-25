<template>
  <el-dialog
  title="设置特殊价"
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
              <check-week-item @change="changeWeekItem"></check-week-item>
            </div>
          </div>
          <div>
            <table class="table center">
              <thead>
                <tr>
                  <th width="40%">房型&售卖规则</th>
                  <th width="10%">佣金</th>
                  <th width="25%">底价</th>
                  <th>卖价</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(option, $optionIndex) in option" :key="$optionIndex">
                  <td>{{option.name}}</td>
                  <td>100%</td>
                  <td>
                    <el-input class="inline marginLR-5" size="small" v-model="testVal" placeholder="请输入价格"></el-input>
                  </td>
                  <td>
                    <el-input class="inline marginLR-5" size="small" v-model="testVal" placeholder="请输入价格"></el-input>
                  </td>
                </tr>
              </tbody>
            </table>
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
import { CheckItem, CheckWeekItem } from "@/components";
export default {
  props: {
    option: {
      type: Array,
      required: true
    }
  },
  components: {
    CheckItem,
    CheckWeekItem
  },
  data() {
    return {
      optionList: this.option,
      dialogVisible: false,
      expireTime: "",
      weekOptionList: [],
      testVal: ""
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
    },
    changeWeekItem(v) {
      console.log(v)
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

