<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>酒店列表</el-breadcrumb-item>
    </el-breadcrumb>
    <header>
      <el-input class="inline" size="small" placeholder="输入酒店名称" v-model="searchInfo.hotelName" clearable></el-input>
      <el-select clearable filterable size="small" v-model="searchInfo.cityCode" placeholder="请选择城市">
        <div slot="prefix" class="search">
          <i class=" box-center el-icon-search v-center"></i>
        </div>
        <el-option
          v-for="(city, $cityIndex) in options.cityList"
          :key="$cityIndex"
          :label="city.cityName"
          :value="city.cityCode">
        </el-option>
      </el-select>
      <el-select size="small" v-model="searchInfo.shelfStatus" placeholder="请选择上架状态">
        <el-option label="不限状态" value="-1"></el-option>
        <el-option label="已上架" value="3"></el-option>
        <el-option label="未上架" value="0"></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="search(1)">
        <i class="icon-search"></i> 查询
      </el-button>
      <el-button size="mini" type="danger" @click="resetSearch">
        <i class="icon-times-circle"></i> 重置
      </el-button>
      <el-button size="mini" type="success" @click="addNewHotel">
        <i class="icon-plus-circle"></i> 新增酒店
      </el-button>
    </header>
    <section class="data-table">
      <el-table
        :data="dataList"
        border
        style="width: 100%;">
        <el-table-column
          prop="pmsId"
          label="pms酒店ID"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="城市"
          width="70">
        </el-table-column>
        <el-table-column
          prop="hotelName"
          label="酒店名称">
        </el-table-column>
        <el-table-column
          prop="psbId"
          label="psb编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="address"
          label="酒店地址">
        </el-table-column>
        <el-table-column
          prop="frontPhone"
          label="前台电话"
          width="120">
        </el-table-column>
        <el-table-column
          label="上架状态"
          width="90">
          <template slot-scope="scope">
            <el-tag size="small" :type="!!scope.row.shelfStatus?'success':'info'">{{scope.row.shelfStatus | onlineStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button class="no-padding" size="mini" plain @click="editHotel(scope.row)">
              <span class="font-12">酒店编辑</span>
            </el-button>
            <el-button class="no-padding" size="mini" type="primary" plain @click="editRoomCountOrPrice(scope.row,'roomCount')">
              <span class="font-12">房量管理</span>
            </el-button>
            <el-button class="no-padding" size="mini" type="success" plain @click="editRoomCountOrPrice(scope.row,'roomPrice')">
              <span class="font-12">房价管理</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer class="text-center">
      <el-pagination
        @current-change="search"
        @size-change="changePageSize"
        :current-page.sync="page.page"
        :page-sizes="page.sizeList"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      // 查询条件
      searchInfo: {
        hotelName: "",
        cityCode: "",
        shelfStatus: "-1"
      },
      // 下拉框信息
      options: {
        cityList: []
      },
      // 表格数据
      dataList: [],
      // 分页信息配置
      page: {
        page: 1,
        size: 10,
        total: 1,
        sizeList: [5, 10, 15, 20]
      }
    };
  },
  methods: {
    ...mapActions(["getGeoOptionAction", "doUserLoginoutAction"]),
    // 获取城市选项
    getCityOptions() {
      this.getGeoOptionAction().then(res => {
        this.options.cityList = this.formatCityList(res);
      });
    },
    // 格式化城市信息
    formatCityList(provinceList) {
      let cityList = [];
      if (provinceList && provinceList.length) {
        provinceList.forEach(province => {
          province.omsCityVoList.forEach(city => {
            cityList.push({
              cityCode: city.cityCode,
              cityName: city.cityName
            });
          });
        });
      }
      return cityList;
    },
    // 查询数据
    search(page) {
      this.page.page = page || 1;
      this.getListData();
    },
    changePageSize(size) {
      this.page.size = size || 10;
      this.getListData();
    },
    // 重置查询条件
    resetSearch() {
      this.searchInfo = {
        hotelName: "",
        cityCode: "",
        shelfStatus: "-1"
      };
      this.page.page = 1;
      this.page.total = 1;
      this.getListData();
    },
    // 获取表格数据
    getListData() {
      let vm = this;
      let params = {
        ...this.searchInfo,
        pageNo: this.page.page,
        pageSize: this.page.size
      };
      params.shelfStatus == "-1" && delete params.shelfStatus;
      this.$root.commonCall("getInnList", params, {
        success(res) {
          vm.dataList = res.data.data.list;
          vm.page.total = res.data.data.pageManager.rowsCount || 0;
        },
        fail(res) {
          if (res.data && res.data.status == "failed") {
            vm.$message.error("登陆已失效，请重新登陆！");
            vm.doUserLoginoutAction();
            vm.$router.push({ name: "login" });
            return;
          }
          vm.$message.error(res.data.message || "获取数据失败！");
        }
      });
    },
    // 创建新酒店
    addNewHotel() {
      this.$router.push({
        name: "hotelManagement",
        params: { component: "hotel-info" },
        query: {}
      });
    },
    // 编辑酒店
    editHotel(hotelInfo) {
      this.$router.push({
        name: "editHotelManagement",
        params: { id: hotelInfo.id, component: "hotel-info" },
        query: {}
      });
    },
    // 房量管理或房价管理
    editRoomCountOrPrice(hotelInfo, pathName) {
      if (hotelInfo.roomTypeNums * 1 <= 0) {
        this.$message.warning("请先添加房型并开通上架！");
        return this.$router.push({
          name: "editHotelManagement",
          params: { id: hotelInfo.id, component: "room-type" },
          query: {}
        });
      }
      if (!hotelInfo.accountId) {
        this.$message.warning("请先开通代销，并上架相关房型！");
        return this.$router.push({
          name: "editHotelManagement",
          params: { id: hotelInfo.id, component: "online-offline" },
          query: {}
        });
      }

      this.$router.push({
        name: pathName,
        params: { innId: hotelInfo.id, accountId: hotelInfo.accountId },
        query: {}
      });
    }
  },
  mounted() {
    this.getCityOptions();
    this.getListData();
  }
};
</script>

<style lang="less" scoped>
.data-table {
  margin: 10px 0;
}
</style>
