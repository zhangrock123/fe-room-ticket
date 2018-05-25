<template>
<div>
  <el-dialog
  title="上架房型"
  :visible.sync="dialogVisible"
  width="90%"
  :before-close="handleClose">
    <div class="dialog-body">
      <div class="open-close-box app-flex app-flex-full">
        <div>
          <check-item v-model="roomTypeOption"></check-item>
        </div>
        <div class="col-1">
          <table class="table center">
            <thead>
              <tr>
                <th width="15%" rowspan="2">房型</th>
                <th width="15%" rowspan="2">绑定房型</th>
                <th width="8%" rowspan="2">房间数</th>
                <th width="8%" rowspan="2">房券数</th>
                <th width="14%" rowspan="2">价格计划</th>
                <th width="10%" rowspan="2">卖价（元）</th>
                <th width="30%">周末价</th>
              </tr>
              <tr>
                <th>
                  <div class="app-flex app-flex-center col-1">
                    <div v-for="(date, $dateIndex) in titleList" :key="$dateIndex">{{date}}</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="selectRoomType.length" v-for="(roomType, $roomTypeIndex) in selectRoomType" :key="$roomTypeIndex">
                <td>
                  {{roomType.name}}
                </td>
                <td>
                  <el-input @focus="selectBindRoomType($roomTypeIndex)" readonly suffix-icon="el-icon-edit" v-model="roomType.relatedRoomName" class="paddingLR-2 inline no-padding text-center" size="mini" placeholder="绑定房型"></el-input>
                </td>
                <td>
                  <el-input v-model="roomType.count" class="paddingLR-2 inline no-padding text-center" size="mini" placeholder="房间数"></el-input>
                </td>
                <td>
                  <el-input v-model="roomType.coupon" clearable class="paddingLR-2 inline no-padding text-center" size="mini" placeholder="房券数"></el-input>
                </td>
                <td>
                  <el-select v-model="roomType.planId" class="paddingLR-2" clearable size="mini" placeholder="价格计划">
                    <el-option
                      v-for="(plan, $planIndex) in planOption"
                      :key="$planIndex"
                      :label="plan.name"
                      :value="plan.id">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="roomType.price" class="paddingLR-2 inline no-padding text-center" size="mini" placeholder="卖价"></el-input>
                </td>
                <td>
                  <div class="app-flex app-flex-center col-1">
                    <div class="paddingLR-2" v-for="(date, $dateIndex) in roomType.weekPrice" :key="$dateIndex">
                      <el-input v-model="date.price" class="inline no-padding text-center" size="mini" placeholder=""></el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-show="!selectRoomType.length">
                <td colspan="7">
                  <div class="padding-10">
                    <i class="el-icon-warning"></i>
                    请从左侧栏选择相应房型
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button size="small" type="success" @click="submit">确认</el-button>
    </div>
  </el-dialog>
  <select-option-dialog @change="checkOption" :column="optionColumn" title="选择绑定房间" ref="selectOptionDialog"></select-option-dialog>
</div>

</template>

<script>
import { CheckItem, SelectOptionDialog } from "@/components";
export default {
  data() {
    return {
      dialogVisible: false,
      roomTypeOption: [],
      titleList: "一二三四五六日".split(""),
      planOption: [],
      optionColumn: [
        {
          title: "序号",
          width: "30%",
          column: "id"
        },
        {
          title: "名称",
          column: "name"
        }
      ],
      cacheSelectedLine: -1,
      selectRoomType: []
    };
  },
  components: {
    CheckItem,
    SelectOptionDialog
  },
  watch: {
    roomTypeOption() {
      let res = [];
      this.roomTypeOption.forEach(v => {
        if (v.checked) {
          res.push({
            id: v.id,
            name: v.name,
            relatedRoomId: "",
            relatedRoomName: "",
            count: "",
            coupon: "",
            planId: "",
            price: "",
            weekPrice: [
              {
                price: ""
              },
              {
                price: ""
              },
              {
                price: ""
              },
              {
                price: ""
              },
              {
                price: ""
              },
              {
                price: ""
              },
              {
                price: ""
              }
            ]
          });
        }
      });
      this.selectRoomType = res;
    }
  },
  computed: {},
  methods: {
    // 显示对话框
    showDialog() {
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交
    submit() {
      this.dialogVisible = false;
      console.log(this.selectRoomType);
    },
    initPlanOption() {
      this.planOption = [
        {
          id: 1,
          name: "预付－无早"
        },
        {
          id: 2,
          name: "预付－单早"
        }
      ];
    },
    selectBindRoomType(index) {
      this.cacheSelectedLine = index;
      this.$refs.selectOptionDialog.showDialog();
    },
    checkOption(option) {
      let curSelectedRoomType = this.selectRoomType[this.cacheSelectedLine];
      curSelectedRoomType.relatedRoomId = option.id;
      curSelectedRoomType.relatedRoomName = option.name;
    }
  },
  mounted() {
    this.initPlanOption();
    this.roomTypeOption = [
      {
        id: "1",
        name: "豪华大床房"
      },
      {
        id: "2",
        name: "标准间"
      }
    ];
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
</style>
