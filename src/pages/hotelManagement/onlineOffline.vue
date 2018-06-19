<template>
  <div>
    <el-tabs v-if="isOpen" type="border-card">
      <el-tab-pane label="未上架房型">
        <offline-room-type :hotel-info="hotelInfo" :room-type-data="roomTypeData" @refresh="refreshRoomType"></offline-room-type>
      </el-tab-pane>
      <el-tab-pane label="已上架房型">
        <online-room-type :hotel-info="hotelInfo" :room-type-data="roomTypeData" @refresh="refreshRoomType"></online-room-type>
      </el-tab-pane>
    </el-tabs>
    <contract-manager  @refresh="refreshHotelDetail" :hotel-info="hotelInfo" v-else></contract-manager>
  </div>
</template>

<script>
const OnlineRoomType = () => import("./onlineOffline/onlineRoomType.vue");
const OfflineRoomType = () => import("./onlineOffline/offlineRoomType.vue");
const ContractManager = () => import("./onlineOffline/contractManager.vue");

export default {
  props: {
    hotelInfo: {
      type: Object
    }
  },
  data() {
    return {
      isOpen: false,
      roomTypeData: {}
    };
  },
  components: {
    OnlineRoomType,
    OfflineRoomType,
    ContractManager
  },
  methods: {
    // 通知刷新酒店信息后，刷新本页ui和房型数据
    refreshHotelDetail(callback = null) {
      this.$emit("refresh", () => {
        this.initPageData();
      });
    },
    // 刷新房型数据
    refreshRoomType(callback = null) {
      this.getRoomTypeList().then(callback);
    },
    // 获取房型数据
    getRoomTypeList() {
      let onlineOfflineRoomData = {};
      let vm = this;
      return this.$root.commonCall(
        "getOnlineOfflineRoomTypeList",
        {
          innId: vm.hotelInfo.fisId,
          accountId: vm.hotelInfo.accountId
        },
        {
          success(res) {
            vm.roomTypeData = vm.formatRoomType(res.data.data);
          },
          failMsg: "获取房型数据失败！"
        }
      );
    },
    // 格式化上下架数据
    formatRoomType(roomTypeList) {
      let res = { online: [], offline: [] };
      if (roomTypeList && roomTypeList.length) {
        roomTypeList.forEach(v =>
          res[!!v.status ? "online" : "offline"].push({ ...v })
        );
      }
      return res;
    },
    // 初始化本页ui和房型数据
    initPageData() {
      this.isOpen = !!this.hotelInfo.accountId;
      this.isOpen && this.getRoomTypeList();
    }
  },
  created() {
    this.initPageData();
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
</style>

