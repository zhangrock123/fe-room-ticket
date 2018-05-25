<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>酒店列表</el-breadcrumb-item>
    </el-breadcrumb>
    <header>
      <el-input class="inline" size="small" placeholder="输入酒店名称" v-model="searchInfo.hotelName" clearable></el-input>
      <el-select clearable size="small" v-model="searchInfo.city" placeholder="请选择城市">
        <el-option
          v-for="(city, $cityIndex) in options.city"
          :key="$cityIndex"
          :label="city.name"
          :value="city.id">
        </el-option>
      </el-select>
      <el-select clearable size="small" v-model="searchInfo.status" placeholder="请选择上架状态">
        <el-option label="已上架" value="1"></el-option>
        <el-option label="未上架" value="0"></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="search">
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
          prop="id"
          label="pms酒店ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="hotelName"
          label="酒店名称">
        </el-table-column>
        <el-table-column
          prop="psb"
          label="psb编码">
        </el-table-column>
        <el-table-column
          prop="address"
          label="酒店地址">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="前台电话">
        </el-table-column>
        <el-table-column
          label="上架状态">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status==1?'success':'info'">{{scope.row.status | onlineStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button class="no-padding" size="mini" plain @click="editHotel(scope.row)">
              <span class="font-12">酒店编辑</span>
            </el-button>
            <el-button class="no-padding" size="mini" type="primary" plain @click="editRoomCount(scope.row)">
              <span class="font-12">房量管理</span>
            </el-button>
            <el-button class="no-padding" size="mini" type="success" plain @click="editRoomPrice(scope.row)">
              <span class="font-12">房价管理</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer class="text-center">
      <el-pagination
        @current-change="changePage"
        :current-page.sync="page.page"
        :page-size="page.size"
        layout="prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </footer>
  </div>
</template>

<script>
import service from "@/service";

export default {
  data() {
    return {
      radio: "1",
      // 查询条件
      searchInfo: {
        hotelName: "",
        city: "",
        status: ""
      },
      // 下拉框信息
      options: {
        city: []
      },
      // 表格数据
      dataList: [],
      // 分页信息配置
      page: {
        page: 1,
        size: 15,
        total: 200
      }
    };
  },
  methods: {
    // 获取城市选项
    getCityOptions() {
      let options = [
        {
          id: 1,
          name: "上海"
        },
        {
          id: 2,
          name: "北京"
        },
        {
          id: 3,
          name: "广州"
        }
      ];
      return new Promise(resolve => {
        setTimeout(() => {
          this.options.city = options;
        }, 500);
      });
    },
    // 查询数据
    search() {
      console.log(this.searchInfo);
    },
    // 重置查询条件
    resetSearch() {
      this.searchInfo = {
        hotelName: "",
        city: "",
        status: ""
      };
    },
    // 获取表格数据
    getListData() {
      /*
      this.$loading.open();
      service
        .getInnList()
        .then(res => {
          if (res.data && res.data.status == 200) {
            this.dataList = res.data.data;
          }
        })
        .finally(() => {
          this.$loading.close();
        });
      */
      let data = [
        {
          id: "001",
          city: "泰州",
          hotelName: "泰州万城宾馆",
          psb: "31111111",
          address: "江苏省泰州市海陵区南通路88号",
          tel: "0523-80918000",
          status: 1
        },
        {
          id: "002",
          city: "泰州",
          hotelName: "泰州万城宾馆",
          psb: "31111112",
          address: "江苏省泰州市泰兴市黄桥镇广场路28号",
          tel: "0523-87155666",
          status: 0
        }
      ];
      return new Promise(resolve => {
        setTimeout(() => {
          this.dataList = data;
        }, 500);
      });
    },
    // 分页切换
    changePage(val) {
      console.log(`当前页: ${val}`);
    },
    // 创建新酒店
    addNewHotel() {
      console.log("addNewHotel");
      this.$router.push({
        name: "hotelManagement",
        params: { component: "hotel-info" },
        query: {}
      });
    },
    // 编辑酒店
    editHotel(hotelInfo) {
      console.log("editHotel", hotelInfo);
      this.$router.push({
        name: "hotelManagement",
        params: { component: "hotel-info" },
        query: {}
      });
    },
    // 房量管理
    editRoomCount(hotelInfo) {
      console.log("editRoomCount", hotelInfo);
      this.$router.push({ name: "roomCount", params: {}, query: {} });
    },
    // 房价管理
    editRoomPrice(hotelInfo) {
      console.log("editRoomPrice", hotelInfo);
      this.$router.push({ name: "roomPrice", params: {}, query: {} });
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
