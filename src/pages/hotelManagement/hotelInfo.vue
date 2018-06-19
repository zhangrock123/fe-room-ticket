<template>
    <div>
      <ul class="form-box">
        <li class="app-flex app-flex-center">
          <label class="required">合作酒店</label>
          <span v-if="hotelInfo">{{formData.coHotel.name}}</span>
          <el-input v-else @focus="showDialog('selectOptionDialog')" prefix-icon="el-icon-search" v-model="formData.coHotel.name" class="inline width-250" size="small" readonly placeholder="合作酒店"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">酒店名称</label>
          <el-input v-model="formData.hotelName" class="inline width-250" size="small" clearable placeholder="酒店名称"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">前台电话</label>
          <el-input v-model="formData.receptionTel" type="tel" class="inline width-250" size="small" clearable placeholder="前台电话"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">老板手机号</label>
          <el-input v-model="formData.bossMobile" type="tel" class="inline width-250" size="small" clearable placeholder="老板手机号"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">房间数量</label>
          <el-input v-model="formData.roomCount" type="number" class="inline width-250" size="small" clearable placeholder="房间数量"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">开业年份</label>
          <el-date-picker class="width-250" v-model="formData.openYear" type="year" size="small" placeholder="选择年份"></el-date-picker>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">装修年份</label>
          <el-date-picker class="width-250" v-model="formData.decorationYear" type="year" size="small" placeholder="选择年份"></el-date-picker>
        </li>
        <li class="app-flex">
          <label class="required">酒店简介</label>
          <div class="col-1">
            <el-input v-model="formData.introduction" type="textarea" rows="5" resize="none" placeholder="酒店简介"></el-input>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">详细地址</label>
          <div class="col-1">
            <geo-option
              :province-code="formData.provinceCode"
              :city-code="formData.cityCode"
              :area-code="formData.areaCode"
              @change="geoChange"
              @updated="geoUpdated"></geo-option>
            <el-input class="inline width-200" size="small" v-model="formData.addressInfo" placeholder="街道"></el-input>
            <el-button size="mini" type="success" @click="searchMap">
              <i class="icon-search"></i> 搜索标注
            </el-button>
          </div>
        </li>
        <li class="app-flex">
          <label>地图标识</label>
          <div class="col-1">
            <baidu-map :is-init="!hotelInfo" ref="baiduMap" v-model="mapLatLon"></baidu-map>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">目的地</label>
          <el-select class="inline width-150" size="small" v-model="formData.destinationCode" filterable placeholder="请选择">
              <div slot="prefix" class="search">
                <i class=" box-center el-icon-search v-center"></i>
              </div>
              <el-option
                v-for="(item,$index) in option.destinationList"
                :key="$index"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </li>
        <li class="app-flex" v-if="hotelInfo && hotelInfo.fisId">
          <label>酒店照片</label>
          <div class="col-1">
            <div class="hotel-cover-box" @click="showDialog('imageUploadDialog')">
              <div class="coverImg" :style="{'backgroundImage': `url(${imgCover})`}"></div>
              <div class="mask">
                <span class="box-center text-center color-slightGray">
                  <i class="el-icon-edit-outline font-40"></i>
                  <div class="font-14">编辑图片</div>
                </span>
              </div>
            </div>
          </div>
        </li>
        <li class="app-flex">
          <label class="required">酒店设施</label>
          <div class="col-1">
            <el-checkbox-group class="row row-5 font-12" v-model="formData.facilityList">
              <el-checkbox v-for="(facility, $facilityIndex) in option.facilityList" :key="$facilityIndex" :label="facility.value*1">{{facility.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
      </ul>
      <footer class="text-center marginT-10">
        <el-button size="small" type="success" @click="confirmSubmit">
          <div class="paddingLR-10">保存</div>
        </el-button>
      </footer>
      <select-option-dialog
        @change="changeCoHotel"
        placeholder="输入酒店名称/psd编码"
        :column="dialog.optionColumn"
        :api-service="dialog.apiService"
        :keyword-column="dialog.keywordColumn"
        title="选择合作酒店"
        ref="selectOptionDialog">
      </select-option-dialog>
      <image-upload-dialog @update="updateImg" title="酒店风光" v-model="formData.imageList" :room-type-data="{}" :hotel-info="hotelInfo" :type="1" ref="imageUploadDialog"></image-upload-dialog>
    </div>
</template>

<script>
import {
  SelectOptionDialog,
  ImageUploadDialog,
  BaiduMap,
  GeoOption
} from "@/components";
import formatter from "./hotelInfo.formatter.js";
import service from "@/service";
import utils from "@/utils";
import { mapActions } from "vuex";

export default {
  props: {
    hotelInfo: {
      type: Object
    }
  },
  data() {
    return {
      // 填写数据信息
      formData: {
        coHotel: {},
        hotelName: "",
        receptionTel: "",
        bossMobile: "",
        roomCount: "",
        openYear: "",
        decorationYear: "",
        introduction: "",
        addressInfo: "", // 街道
        destinationCode: "", // 目的地
        imageList: [],
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        geoInfo: {}, // 省市区数据
        facilityList: []
      },
      // 选项数据
      option: {
        destinationList: [],
        facilityList: []
      },
      mapLatLon: [121.7, 31.19],
      // 弹窗数据
      dialog: {
        optionColumn: [],
        apiService: null
      }
    };
  },
  computed: {
    imgCover() {
      let res = "";
      this.formData.imageList.length &&
        (res = this.formData.imageList[0].imgUrl);
      return res;
    }
  },
  components: {
    SelectOptionDialog,
    ImageUploadDialog,
    BaiduMap,
    GeoOption
  },
  methods: {
    ...mapActions(["getDictOptionAction", "getDestinationOptionAction"]),

    // 省市区值改变事件
    geoChange(geoInfo) {
      this.geoUpdated(geoInfo);
      this.searchMap();
    },
    // 更新省市区信息回调事件
    geoUpdated(geoInfo) {
      this.formData.geoInfo = geoInfo;
    },
    // 弹框数据回调
    changeCoHotel(option) {
      this.formData.coHotel = option;
      service.getCooperationHotelDetail({ hotelId: option.id }).then(res => {
        if (res.success) {
          this.initCoHotel(res.data.data);
        }
      });
    },
    // 根据所选的合作酒店进行数据初始化
    initCoHotel(data) {
      this.formData = formatter.FormatterCooperationHotelData(
        data,
        this.formData
      );
      this.mapLatLon = [data.baiduLon, data.baiduLat];
      this.$refs.baiduMap.search(this.mapLatLon);
    },
    // 获取目的地数据
    initDestinationListOption() {
      return new Promise(resolve => {
        this.getDestinationOptionAction()
          .then(
            res => {
              this.option.destinationList = res;
            },
            () => {
              this.$message.warning("获取目的地数据失败！");
            }
          )
          .finally(resolve);
      });
    },
    // 获取酒店设施信息以及缓存用于其他选项的数据
    initFacilityOption() {
      return new Promise(resolve => {
        this.getDictOptionAction({ optionName: "facilities" })
          .then(
            res => {
              this.option.facilityList = res;
            },
            () => {
              this.$message.warning("获取酒店设施数据失败！");
            }
          )
          .finally(resolve);
      });
    },
    // 点击显示dialog
    showDialog(refName) {
      this.$refs[refName].showDialog();
    },
    // 提示和输入项判断，之后执行提交保存
    confirmSubmit() {
      let checkParamStatus = formatter.CheckParamStatus(this.formData);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      let param;
      this.$confirm("是否确认保存酒店资料？", "提示", {
        type: "warning"
      }).then(res => {
        this.submit();
      });
    },
    // 数据保存
    submit() {
      let param = formatter.FormatterSubmitData(
        this.formData,
        this.mapLatLon,
        this.hotelInfo
      );
      let vm = this;
      return this.$root.commonCall("createOrUpdateHotelInfo", param, {
        success(res) {
          vm.$message.success("保存酒店信息成功！");
          if (vm.hotelInfo) {
            vm.$emit("refresh");
          } else {
            vm.$router.push({ name: "index" });
          }
        },
        failMsg: "保存信息失败！"
      });
    },
    // 图片信息排序保存
    updateImg(imgList) {
      this.formData.imageList = imgList;
      // this.hotelInfo.fisId && this.submit();
    },
    // 初始化信息
    initData() {
      return Promise.all([
        this.initDestinationListOption(),
        this.initFacilityOption()
      ]);
    },
    // 百度地图搜索
    searchMap() {
      let searchKeyword = formatter.FormatterSearchMapData(this.formData);
      searchKeyword && this.$refs.baiduMap.search(searchKeyword);
    },
    // 对话框初始化
    initDialogSettings() {
      this.dialog = {
        optionColumn: formatter.FormatterOptionDialogColumn(),
        keywordColumn: "nameOrPsb",
        apiService: service.getCooperationHotelList
      };
    },
    // 初始化默认数据
    initDefaultData() {
      if (!this.hotelInfo) {
        return;
      }
      this.formData = formatter.FormatterDefaultHotelData(this.hotelInfo);
      this.mapLatLon = [this.hotelInfo.baiduLon, this.hotelInfo.baiduLat];
      setTimeout(() => {
        this.$refs.baiduMap && this.$refs.baiduMap.search(this.mapLatLon);
      }, 300);
    }
  },
  mounted() {
    this.$loading.open();
    this.initData()
      .then(() => {
        this.initDialogSettings();
        this.initDefaultData();
      })
      .finally(() => {
        this.$loading.close();
      });
  }
};
</script>



<style lang="less" scoped>
.form-box {
  li {
    margin-bottom: 10px;
    > label {
      width: 80px;
      // text-align: right;
    }
    .hotel-cover-box {
      width: 280px;
      height: 200px;
      border: 1px solid #eee;
      position: relative;
      .coverImg {
        height: 100%;
      }
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          transition: all 0.3s ease;
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
}
</style>




