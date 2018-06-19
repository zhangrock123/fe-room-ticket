<template>
  <span>
    <el-select class="width-150" size="small" @change="provinceChange" v-model="geo.provinceCode" filterable placeholder="省">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
        v-for="(item,$index) in option.provinceList"
        :key="$index"
        :label="item.provinceName"
        :value="item.provinceCode">
        </el-option>
    </el-select>
    <el-select class="width-150" size="small" @change="cityChange" v-model="geo.cityCode" filterable placeholder="市">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
        v-for="(item,$index) in option.cityList"
        :key="$index"
        :label="item.cityName"
        :value="item.cityCode">
        </el-option>
    </el-select>
    <el-select class="width-150" size="small" @change="areaChange" v-model="geo.areaCode" filterable placeholder="区">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
        v-for="(item,$index) in option.areaList"
        :key="$index"
        :label="item.areaName"
        :value="item.areaCode">
        </el-option>
    </el-select>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    provinceCode: {
      type: String
    },
    cityCode: {
      type: String
    },
    areaCode: {
      type: String
    }
  },
  data() {
    return {
      geo: {
        provinceCode: "",
        cityCode: "",
        areaCode: ""
      },
      option: {
        provinceList: [],
        cityList: [],
        areaList: []
      }
    };
  },
  watch: {
    provinceCode() {
      this.emit("updated");
    },
    cityCode() {
      this.emit("updated");
    },
    areaCode() {
      this.emit("updated");
    }
  },
  methods: {
    ...mapActions([
      "getGeoOptionAction",
      "getDictOptionAction",
      "getDestinationOptionAction"
    ]),
    // 获取省市区信息数据
    initProvinceListOption() {
      return new Promise(resolve => {
        this.getGeoOptionAction()
          .then(
            res => {
              this.option.provinceList = res;
            },
            () => {
              this.$message.warning("获取省市区数据失败！");
            }
          )
          .finally(resolve);
      });
    },
    // 省份下拉框change事件
    provinceChange() {
      this.option.cityList = [];
      this.geo.cityCode = "";
      this.option.areaList = [];
      this.geo.areaCode = "";
      this.getCityListOption(this.geo.provinceCode);
      this.emit("change");
    },
    // 城市下拉框change事件
    cityChange() {
      this.option.areaList = [];
      this.geo.areaCode = "";
      this.getAreaListOption(this.geo.cityCode);
      this.emit("change");
    },
    // 区域下拉框change事件
    areaChange() {
      this.emit("change");
    },
    // 根据省份code设置城市列表数据
    getCityListOption(provinceCode) {
      let curProvinceData = this.option.provinceList.filter(
        v => v.provinceCode == provinceCode
      );
      this.option.cityList = curProvinceData[0].omsCityVoList;
    },
    // 根据城市code设置区域列表数据
    getAreaListOption(cityCode) {
      let curCityData = this.option.cityList.filter(
        v => v.cityCode == cityCode
      );
      this.option.areaList = curCityData[0].areaVoList;
    },
    // 获得选中的地理数据
    getGeoFullInfo() {
      let provinceCode = this.geo.provinceCode;
      let cityCode = this.geo.cityCode;
      let areaCode = this.geo.areaCode;
      return {
        provinceCode,
        provinceName: this.getGeoNameByCode("province", provinceCode),
        cityCode,
        cityName: this.getGeoNameByCode("city", cityCode),
        areaCode,
        areaName: this.getGeoNameByCode("area", areaCode)
      };
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
        code &&
        this.option[dictConfig.option].some(v => {
          if (v[dictConfig.code] == code) {
            return (typeName = v[dictConfig.name]);
          }
        });
      return typeName;
    },
    // 初始化显示默认省市区数据
    initDefaultGeo(callback) {
      if (this.provinceCode) {
        this.geo.provinceCode = this.provinceCode;
        this.getCityListOption(this.geo.provinceCode);
        if (!this.cityCode && callback) {
          return callback();
        }
      }
      if (this.cityCode) {
        this.geo.cityCode = this.cityCode;
        this.getAreaListOption(this.geo.cityCode);
        if (!this.areaCode && callback) {
          return callback();
        }
      }
      if (this.areaCode) {
        this.geo.areaCode = this.areaCode;
        callback && callback();
      }
    },
    // 组件数据改变回调
    emit(emitName) {
      this.initDefaultGeo(() => {
        setTimeout(() => {
          this.$emit(emitName || "change", this.getGeoFullInfo());
        }, 100);
      });
    }
  },
  mounted() {
    this.initProvinceListOption().then(() => {
      this.emit("change");
    });
  }
};
</script>

<style lang="less" scoped>
</style>


