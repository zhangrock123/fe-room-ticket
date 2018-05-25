<template>
   <el-dialog
    title="编辑默认价"
    :visible.sync="dialogVisible"
    custom-class="common-dialog normal-size"
    :before-close="handleClose">
    <div class="dialog-body">
      <header>
        豪华大床房
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
                <el-checkbox v-model="week.checked" @change="setCheckedItem">
                  <div class="font-12">{{week.name}}</div>
                </el-checkbox>
              </li>
              <li>】</li>
            </ul>
          </div>
          <div class="paddingL-5">
            <el-checkbox v-model="isUnionSetWeek" @change="setCheckedMain">
              <div class="font-12">统一设置周末价</div>
            </el-checkbox>
          </div>
        </div>

      </section>
      <section>
        <table class="table center">
          <thead>
            <tr>
              <th width="30%">价格类型</th>
              <th width="35%">底价(元／间夜)</th>
              <th>卖价(元／间夜)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>平时</td>
              <td>
                <el-input class="inline" size="small" v-model="testVal" placeholder="请输入价格"></el-input>
              </td>
              <td>
                <el-input class="inline" size="small" v-model="testVal" placeholder="请输入价格"></el-input>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <div slot="footer">
      <el-button size="small" type="success" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      isAddWeekendPrice: false,
      weekendList: [],
      isUnionSetWeek: false,
      weekPriceList: [],
      testVal: ""
    };
  },
  methods: {
    // 显示对话框
    showDialog() {
      this.initWeekendList();
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交
    submit() {
      this.dialogVisible = false;
      console.log(this.dataList);
    },
    initWeekendList() {
      let weekendList = [];
      const weekendStr = "一二三四五六日";
      weekendStr.split("").forEach(v => {
        weekendList.push({
          name: `周${v}`,
          checked: false
        });
      });
      this.weekendList = weekendList;
    },
    setCheckedItem() {
      this.isUnionSetWeek = false;
    },
    setCheckedMain() {
      this.weekendList.forEach(v => {
        v.checked = false;
      });
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
