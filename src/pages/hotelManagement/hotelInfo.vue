<template>
    <div>
      <ul class="form-box">
        <li class="app-flex app-flex-center">
          <label>签约经理</label>
          <el-input v-model="formData.manager" size="small" class="inline width-200"></el-input>
          <div class="col-1 color-gray marginL-10">
            <i class="el-icon-warning"></i> 不填写默认显示指定的账号
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">合作酒店</label>
          <el-input @focus="showDialog('selectOptionDialog')" prefix-icon="el-icon-search" v-model="formData.coHotel" class="inline width-200" size="small" readonly clearable placeholder="合作酒店"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">酒店名称</label>
          <el-input v-model="formData.hotelName" class="inline width-200" size="small" clearable placeholder="酒店名称"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">前台电话</label>
          <el-input v-model="formData.receptionTel" type="tel" class="inline width-200" size="small" clearable placeholder="前台电话"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">老板手机号</label>
          <el-input v-model="formData.bossMobile" type="tel" class="inline width-200" size="small" clearable placeholder="老板手机号"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">房间数量</label>
          <el-input v-model="formData.roomCount" type="number" class="inline width-200" size="small" clearable placeholder="房间数量"></el-input>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">开业年份</label>
          <el-date-picker class="width-200" v-model="formData.openYear" type="year" size="small" placeholder="选择日期"></el-date-picker>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">装修年份</label>
          <el-date-picker class="width-200" v-model="formData.decorationYear" type="year" size="small" placeholder="选择日期"></el-date-picker>
        </li>
        <li class="app-flex">
          <label class="required">酒店简介</label>
          <div class="col-1">
            <el-input v-model="formData.hotelInfo" type="textarea" rows="5" resize="none" placeholder="酒店简介"></el-input>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">详细地址</label>
          <div class="col-1">
            <el-select class="width-150" size="small" @change="provinceChange" v-model="formData.provinceCode" filterable placeholder="省">
                <el-option
                v-for="(item,$index) in option.provinceList"
                :key="$index"
                :label="item.provinceName"
                :value="item.provinceCode">
                </el-option>
            </el-select>
            <el-select class="width-150" size="small" @change="cityChange" v-model="formData.cityCode" filterable placeholder="市">
                <el-option
                v-for="(item,$index) in option.cityList"
                :key="$index"
                :label="item.cityName"
                :value="item.cityCode">
                </el-option>
            </el-select>
            <el-select class="width-150" size="small" @change="areaChange" v-model="formData.areaCode" filterable placeholder="区">
                <el-option
                v-for="(item,$index) in option.areaList"
                :key="$index"
                :label="item.areaName"
                :value="item.areaCode">
                </el-option>
            </el-select>
            <el-input class="inline width-200" size="small" v-model="formData.addressInfo" placeholder="街道"></el-input>
            <el-button size="mini" type="success" @click="searchMap">
              <i class="icon-search"></i> 搜索标注
            </el-button>
          </div>
        </li>
        <li class="app-flex">
          <label>地图标识</label>
          <div class="col-1">
            <baidu-map ref="baiduMap" v-model="mapLatLon"></baidu-map>
          </div>
        </li>
        <li class="app-flex app-flex-center">
          <label class="required">目的地</label>
          <el-select class="inline width-200" size="small" v-model="formData.destinationCode" filterable placeholder="请选择">
              <el-option
                v-for="(item,$index) in option.destinationList"
                :key="$index"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </li>
        <li class="app-flex">
          <label>酒店照片</label>
          <div class="col-1">
            <div class="hotel-cover-box" @click="showDialog('imageUploadDialog')">
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
          <label>酒店设施</label>
          <div class="col-1">
            <el-row>
              <el-col :span="4" v-for="(facility, $facilityIndex) in option.facilityList" :key="$facilityIndex">
                <el-checkbox v-model="facility.checked">
                  <div class="font-12">{{facility.name}}</div>
                </el-checkbox>
              </el-col>
            </el-row>
          </div>
        </li>
      </ul>
      <footer class="text-center marginT-10">
        <el-button size="small" type="success" @click="saveData">
          <div class="paddingLR-10">保存</div>
        </el-button>
      </footer>
      <select-option-dialog @change="changeCoHotel" :column="dialog.optionColumn" title="选择合作酒店" ref="selectOptionDialog"></select-option-dialog>
      <image-upload-dialog title="酒店风光" v-model="formData.imageList" ref="imageUploadDialog"></image-upload-dialog>
    </div>
</template>

<script>
import { SelectOptionDialog, ImageUploadDialog, BaiduMap } from "@/components";
import service from "@/service";
import utils from "@/utils";

export default {
  data() {
    return {
      // 填写数据信息
      formData: {
        manager: "",
        coHotel: "",
        hotelName: "",
        receptionTel: "",
        bossMobile: "",
        roomCount: "",
        openYear: "",
        decorationYear: "",
        hotelInfo: "",
        provinceCode: "", // 省份
        cityCode: "", // 城市
        areaCode: "", // 地区
        addressInfo: "", // 街道
        destinationCode: "", // 目的地
        imageList: []
      },
      // 选项数据
      option: {
        provinceList: [],
        cityList: [],
        areaList: [],
        destinationList: [],
        facilityList: []
      },
      mapLatLon: [121.7, 31.19],
      // 弹窗数据
      dialog: {
        optionColumn: [
          {
            title: "酒店id",
            column: "id"
          },
          {
            title: "名称",
            column: "name"
          }
        ]
      }
    };
  },
  components: {
    SelectOptionDialog,
    ImageUploadDialog,
    BaiduMap
  },
  methods: {
    // 弹框数据回调
    changeCoHotel(option) {
      this.formData.coHotel = option.name;
    },
    /**
     * 基础数据获取方法
     * settings 可配置参数如下：
     *  serviceName 调用服务接口名
     *  param 调用接口传参
     *  optionName option中指定的key值
     *  resColumnName 返回数据中的key值
     *  isUseCache 是否使用缓存
     *  failMsg 接口请求失败显示的提示
     *  expr 自定义赋值方法
     */
    _baseQuery(settings) {
      let vm = this;
      !!settings.loading && this.$loading.open();
      return new Promise(resolve => {
        if (!!settings.isUseCache) {
          this.option[settings.optionName] =
            utils.getStore(settings.optionName) || [];
          if (this.option[settings.optionName].length) {
            !!settings.loading && vm.$loading.close();
            return resolve();
          }
        }
        service[settings.serviceName](settings.param || {})
          .then(res => {
            if (res.data && res.data.status == 200) {
              if (settings.expr) {
                settings.expr(res);
              } else {
                this.option[settings.optionName] =
                  res.data[settings.resColumnName];
                if (!!settings.isUseCache) {
                  utils.setStore(
                    settings.optionName,
                    this.option[settings.optionName]
                  );
                }
              }
            } else {
              this.$message.warning(settings.failMsg || "获取数据失败！");
            }
          })
          .finally(() => {
            !!settings.loading && vm.$loading.close();
            resolve();
          });
      });
    },
    // 获取省市区信息数据
    initProvinceListOption() {
      return this._baseQuery({
        serviceName: "getReginData",
        isUseCache: true,
        optionName: "provinceList",
        resColumnName: "result",
        failMsg: "获取省市区数据失败！"
      });
    },
    // 获取目的地数据
    initDestinationListOption() {
      return this._baseQuery({
        serviceName: "getDesitionData",
        isUseCache: true,
        optionName: "destinationList",
        resColumnName: "result",
        failMsg: "获取目的地数据失败！"
      });
    },
    // 获取酒店设施信息以及缓存用于其他选项的数据
    initFacilityOption() {
      let vm = this;
      this._baseQuery({
        serviceName: "getDictionaryData",
        isUseCache: true,
        optionName: "facilityList",
        failMsg: "获取酒店设施数据失败！",
        expr(res) {
          res.data.list &&
            res.data.list.forEach(v => {
              if (v.conType == "facilities") {
                vm.option.facilityList = v.dic;
              }
              // 缓存相应配置数据
              utils.setStore(v.conType, v.dic);
            });
        }
      });
    },
    // 省份下拉框change事件
    provinceChange() {
      this.option.cityList = [];
      this.formData.cityCode = "";
      this.option.areaList = [];
      this.formData.areaCode = "";
      let curProvinceData = this.option.provinceList.filter(v => {
        return v.provinceCode == this.formData.provinceCode;
      });
      this.option.cityList = curProvinceData[0].omsCityVoList;
      this.searchMap();
    },
    // 城市下拉框change事件
    cityChange() {
      this.option.areaList = [];
      this.formData.areaCode = "";
      let curCityData = this.option.cityList.filter(v => {
        return v.cityCode == this.formData.cityCode;
      });
      this.option.areaList = curCityData[0].areaVoList;
      this.searchMap();
    },
    // 区域下拉框change事件
    areaChange() {
      this.searchMap();
    },
    // 根据当前选择的code信息，获取选择的省市区的名称
    getGeoNameByCode(type, code) {
      let dictConfig = {
        province: {
          option: "provinceList",
          name: "provinceName",
          code: "provinceCode"
        },
        city: {
          option: "cityList",
          name: "cityName",
          code: "cityCode"
        },
        area: {
          option: "areaList",
          name: "areaName",
          code: "areaCode"
        }
      }[type];
      let typeName = "";
      dictConfig &&
        this.option[dictConfig.option].some(v => {
          if (v[dictConfig.code] == code) {
            return (typeName = v[dictConfig.name]);
          }
        });
      return typeName;
    },
    // 点击显示dialog
    showDialog(refName) {
      this.$refs[refName].showDialog();
    },
    // 数据保存
    saveData() {
      console.log(this.mapLatLon);
    },
    // 初始化信息
    initData() {
      return Promise.all([
        this.initProvinceListOption(),
        this.initDestinationListOption(),
        this.initFacilityOption()
      ]);
    },
    // 百度地图搜索
    searchMap() {
      let provinceName = this.getGeoNameByCode(
        "province",
        this.formData.provinceCode
      );
      let cityName = this.getGeoNameByCode("city", this.formData.cityCode);
      let areaName = this.getGeoNameByCode("area", this.formData.areaCode);
      let addressInfo = this.formData.addressInfo;
      let searchKeyword = "";
      provinceName && (searchKeyword += provinceName);
      provinceName && cityName && (searchKeyword += cityName);
      provinceName && cityName && areaName && (searchKeyword += areaName);
      provinceName &&
        cityName &&
        areaName &&
        addressInfo &&
        (searchKeyword += addressInfo);
      if (!searchKeyword) {
        return;
      }
      this.$refs.baiduMap.search(searchKeyword);
    }
  },
  mounted() {
    this.$loading.open();
    this.initData()
      .then(() => {})
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




