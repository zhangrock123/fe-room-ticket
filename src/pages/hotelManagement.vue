<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumbName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-if="hotelId" v-model="activeTab" type="card" @tab-click="changeTab">
      <el-tab-pane
        v-for="(tab, $tabIndex) in tabList"
        :key="$tabIndex"
        :label="tab.label"
        :name="tab.componentName"></el-tab-pane>
    </el-tabs>
    <div>
      <component :is="useComponent" :hotel-info.sync="hotelInfo" @refresh="refreshTabConfig"></component>
    </div>
  </div>
</template>

<script>
const HotelInfo = () => import("./hotelManagement/hotelInfo.vue");
const RoomType = () => import("./hotelManagement/roomType.vue");
const OnlineOffline = () => import("./hotelManagement/onlineOffline.vue");

export default {
  data() {
    return {
      activeTab: this.$route.params.component || "hotel-info",
      tabList: [],
      tabConfig: {},
      hotelId: this.$route.params.id || "",
      hotelInfo: null
    };
  },
  components: {
    HotelInfo,
    OnlineOffline,
    RoomType
  },
  watch: {
    $route() {
      this.activeTab = this.$route.params.component || "hotel-info";
    }
  },
  computed: {
    // 面包屑设置
    breadcrumbName() {
      return (
        this.tabConfig[this.activeTab] && this.tabConfig[this.activeTab].label
      );
    },
    // component切换设置
    useComponent() {
      return (
        this.tabConfig[this.activeTab] &&
        this.tabConfig[this.activeTab].component
      );
    }
  },
  methods: {
    // tab点击切换事件
    changeTab(tab, event) {
      this.$router.push({
        name: "editHotelManagement",
        params: { id: this.hotelId, component: this.activeTab }
      });
    },
    // 设置tab信息
    initTabList() {
      let tabList = [];
      for (let key in this.tabConfig) {
        tabList.push({
          componentName: key,
          label: this.tabConfig[key].label
        });
      }
      this.tabList = tabList;
    },
    // 设置tab对应的名称及component
    initTabConfig() {
      let config = {
        "hotel-info": {
          label: "分销酒店资料",
          component: HotelInfo
        },
        "room-type": {
          label: "房型管理",
          component: RoomType
        },
        "online-offline": {
          label: "房型上架管理",
          component: OnlineOffline
        }
      };
      let showMenu = { "hotel-info": config["hotel-info"] };
      if (this.hotelInfo) {
        showMenu["room-type"] = config["room-type"];
        if (this.hotelInfo.roomTypeNums * 1) {
          showMenu["online-offline"] = config["online-offline"];
        }
      }
      this.tabConfig = showMenu;
      // this.tabConfig=config;
    },
    // 获取酒店信息
    getHotelInfo(callback) {
      let vm = this;
      return this.$root.commonCall(
        "getInnDetail",
        { hotelId: vm.hotelId },
        {
          success(res) {
            vm.hotelInfo = res.data.data;
          },
          failMsg: "获取酒店数据失败！"
        }
      );
    },
    pageNext(callback) {
      if (!this.hotelId) {
        return callback();
      }
      this.getHotelInfo().then(callback);
    },
    refreshTabConfig(callback) {
      this.getHotelInfo().then(() => {
        this.initTabConfig();
        this.initTabList();
        callback && callback();
      });
    }
  },
  mounted() {
    this.pageNext(() => {
      this.initTabConfig();
      this.initTabList();
    });
  }
};
</script>

<style lang="less" scoped>
</style>

