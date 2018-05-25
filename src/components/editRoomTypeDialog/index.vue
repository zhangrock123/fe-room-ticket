<template>
  <el-dialog
    title="编辑房型信息"
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
            <el-input class="inline" size="small" placeholder="输入房型名称" v-model="roomTypeData.name" clearable></el-input>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label>楼层</label>
          <div class="col-1">
            <el-input class="inline" size="small" placeholder="输入楼层" v-model="roomTypeData.floor" clearable></el-input> 层
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label>面积</label>
          <div class="col-1">
            <el-input class="inline" size="small" placeholder="输入面积" v-model="roomTypeData.floor" clearable></el-input> 平方米
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">床型</label>
          <div class="col-1">
            <el-select clearable size="small" v-model="roomTypeData.bedType" placeholder="请选择床型">
              <el-option
                v-for="(type, $typeIndex) in options.bedType"
                :key="$typeIndex"
                :label="type.name"
                :value="type.id">
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">床宽</label>
          <div class="col-1">
            <el-input class="inline" size="small" placeholder="输入床宽" v-model="roomTypeData.bedWidth" clearable></el-input> 厘米
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">房型设施</label>
          <div class="col-1">
            <el-row>
              <el-col :span="8" v-for="(facility, $facilityIndex) in options.facility" :key="$facilityIndex">
                <el-checkbox v-model="facility.checked">
                  <div class="font-12">{{facility.name}}</div>
                </el-checkbox>
              </el-col>
            </el-row>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">房型简介</label>
          <div class="col-1">
            <limit-input
              v-model="roomTypeData.remark"
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
import utils from "@/utils";
import service from "@/service";

export default {
  data() {
    return {
      dialogVisible: false,
      roomTypeData: {
        name: "",
        floor: "",
        area: "",
        bedType: "",
        bedWidth: "",
        facility: [],
        remark: ""
      },
      options: {
        bedType: [],
        facility: [],
        remarkLimitCount: 200
      }
    };
  },
  components: {
    LimitInput
  },
  computed: {},
  methods: {
    // 显示对话框
    showDialog() {
      this.initOptions();
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
    initOptions() {
      this.$loading.open();
      return new Promise(resolve => {
        let cacheBedTypeOption = utils.getStore("bedType");
        let cacheFacilityOption = utils.getStore("roomFacilities");
        if (cacheBedTypeOption && cacheFacilityOption) {
          this.$loading.close();
          this.options.facility = cacheFacilityOption;
          this.options.bedType = cacheBedTypeOption;
          return resolve();
        }
        service
          .getDictionaryData()
          .then(res => {
            if (res.data && res.data.status == 200) {
              res.data.list &&
                res.data.list.forEach(v => {
                  v.conType == "roomFacilities" &&
                    (this.options.facility = v.dic);
                  v.conType == "bedType" && (this.options.bedType = v.dic);
                  // 缓存相应配置数据
                  utils.setStore(v.conType, v.dic);
                });
            } else {
              this.$message.warning("获取选项数据失败！");
            }
          })
          .finally(() => {
            this.$loading.close();
            resolve();
          });
      });
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

