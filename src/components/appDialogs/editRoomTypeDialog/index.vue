<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    custom-class="common-dialog small-size"
    :before-close="handleClose">
    <div class="dialog-body">
      <ul class="input-section">
        <li class="app-flex app-flex-center">
          <label class="required">
            房型名称
          </label>
          <div class="col-1">
            <el-input :disabled="!!roomTypeData.roomTypeId" class="inline" size="small" placeholder="输入房型名称" v-model="roomTypeData.roomTypeName" clearable></el-input>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label>楼层</label>
          <div class="col-1">
            <el-input class="inline" size="small" placeholder="输入楼层" v-model="roomTypeData.floorNum" clearable></el-input> 层
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label>面积</label>
          <div class="col-1">
            <el-input class="inline" size="small" placeholder="输入面积" v-model="roomTypeData.roomArea" clearable></el-input> 平方米
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">床型</label>
          <div class="col-1">
            <el-select filterable clearable size="small" v-model="roomTypeData.bedType" placeholder="请选择床型">
              <el-option
                v-for="(type, $typeIndex) in options.bedType"
                :key="$typeIndex"
                :label="type.name"
                :value="type.value">
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">床宽</label>
          <div class="col-1">
            <el-input class="inline" size="small" placeholder="输入床宽" v-model="roomTypeData.bedWid" clearable></el-input> 厘米
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">房型设施</label>
          <div class="col-1">
            <el-checkbox-group class="row row-3 font-12" v-model="roomTypeData.facilities">
              <el-checkbox v-for="(facility, $facilityIndex) in options.facilityList" :key="$facilityIndex" :label="facility.value*1">{{facility.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">房型简介</label>
          <div class="col-1">
            <limit-input
              v-model="roomTypeData.roomInfo"
              :placeholder="`不超过${options.remarkLimitCount}字`"
              :count="options.remarkLimitCount"
            ></limit-input>
          </div>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <el-button size="small" type="success" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { LimitInput } from "@/components";
import { mapActions } from "vuex";
import formatter from "./formatter.js";

export default {
  props: {
    title: {
      type: String,
      default: "编辑房型"
    },
    hotelId: {
      type: String / Number,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      roomTypeId: "",
      roomTypeData: {
        innId: this.hotelId,
        roomTypeName: "",
        floorNum: "",
        roomArea: "",
        bedType: "",
        bedWid: "",
        facilities: [],
        roomInfo: "",
        recommend: 0,
        imgList: [],
        bedLen: "",
        bedNum: ""
      },
      options: {
        bedType: [],
        facilityList: [],
        remarkLimitCount: 200
      }
    };
  },
  components: {
    LimitInput
  },
  computed: {},
  methods: {
    ...mapActions(["getDictOptionAction"]),
    // 显示对话框
    showDialog(data) {
      this.initOptions().then(res => {
        this.initData(data);
        this.dialogVisible = true;
      });
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交
    submit() {
      let checkParamStatus = formatter.CheckParamStatus(this.roomTypeData);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      let param;
      let vm = this;
      this.$confirm("是否确认保存酒店资料？", "提示", {
        type: "warning"
      }).then(res => {
        param = formatter.FormatterSubmitData(
          this.roomTypeData,
          this.roomTypeId
        );
        this.$root.commonCall("createOrUpdateHotelRoomType", param, {
          success(res) {
            vm.$message.success("保存房型信息成功！");
            vm.dialogVisible = false;
            vm.$emit("change");
          },
          failMsg: "保存信息失败！"
        });
      });
    },
    // 初始化下拉框数据
    initOptions() {
      this.$loading.open();
      return new Promise(resolve => {
        this.getDictOptionAction({ optionName: "bedType" })
          .then(
            bedTypeList => {
              this.options.bedType = bedTypeList;
              return this.getDictOptionAction({ optionName: "roomFacilities" });
            },
            err => {
              this.$message.warning("获取选项数据失败！");
            }
          )
          .then(roomFacilitiesList => {
            this.options.facilityList = roomFacilitiesList;
          })
          .finally(() => {
            this.$loading.close();
            resolve();
          });
      });
    },
    // 初始化页面数据
    initData(data) {
      if (!data) {
        data = {
          innId: this.hotelId,
          imgList: []
        };
      }
      this.roomTypeData = formatter.FormatterDefaultData(data);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.dialog-body {
  min-height: 200px;
  .input-section {
    margin-bottom: 15px;
    li {
      > *:first-child {
        width: 80px;
      }
      + li {
        margin-top: 10px;
      }
    }
  }
}
</style>

