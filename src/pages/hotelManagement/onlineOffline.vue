<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="未上架房型">
        <offline-room-type></offline-room-type>
      </el-tab-pane>
      <el-tab-pane label="已上架房型">
        <online-room-type></online-room-type>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const OnlineRoomType = () => import("./onlineOffline/onlineRoomType.vue");
const OfflineRoomType = () => import("./onlineOffline/offlineRoomType.vue");
export default {
  data() {
    return {};
  },
  components: {
    OnlineRoomType,
    OfflineRoomType
  }
};
</script>
<style lang="less" scoped>
</style>

