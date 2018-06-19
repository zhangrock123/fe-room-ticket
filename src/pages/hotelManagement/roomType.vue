<template>
  <div class="room-type-box">
    <el-alert
      title="房型信息使用于第三方卖房渠道对接时提供的房型相关资料，请确保房型信息的真实性、完整性！"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>
    <div class="marginTB-10">
      <el-button size="mini" type="success" @click="addNewRoomType">
        <i class="icon-plus-circle"></i> 新建房型
      </el-button>
    </div>
    <section>
      <div class="room-type-card-box" v-if="roomList.length">
        <div class="room-type-card" v-for="(room, $roomIndex) in roomList" :key="$roomIndex">
            <room-type-card @change="refreshHotelAndGetRoomList" :hotel-info="hotelInfo" :room-data="roomList[$roomIndex]"></room-type-card>
        </div>
      </div>
      <div v-else class="text-center padding-10 marginT-10 color-gray font-12">
        <i class="el-icon-warning font-12"></i>
        暂无房型信息，请“
        <el-button type="text"  @click="addNewRoomType">
          <span class="font-12">新建房型</span>
        </el-button>”
      </div>
    </section>
    <edit-room-type-dialog :hotel-id="hotelInfo.fisId" @change="refreshHotelAndGetRoomList" title="新增房型" ref="editRoomTypeDialog"></edit-room-type-dialog>
  </div>
</template>

<script>
import { RoomTypeCard, EditRoomTypeDialog } from "@/components";

export default {
  props: {
    hotelInfo: {
      type: Object
    }
  },
  data() {
    return {
      roomList: []
    };
  },
  components: {
    RoomTypeCard,
    EditRoomTypeDialog
  },
  methods: {
    // 新建房型
    addNewRoomType() {
      this.$refs.editRoomTypeDialog.showDialog();
    },
    // 获取房型数据
    getRoomList() {
      let vm = this;
      return this.$root.commonCall(
        "getHotelRoomTypeList",
        { hotelId: vm.hotelInfo.fisId },
        {
          success(res) {
            let roomList = res.data.data || [];
            roomList.forEach(v => {
              v.imgList = v.imgList || [];
            });
            vm.roomList = roomList;
          },
          failMsg: "获取房型数据失败！"
        }
      );
    },
    refreshHotelAndGetRoomList() {
      this.$emit("refresh", () => {
        this.getRoomList();
      });
    }
  },
  beforeMount() {
    this.getRoomList();
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.room-type-card-box:after {
  content: "";
  display: block;
  width: 1px;
  height: 1px;
  clear: both;
}
.room-type-card {
  width: 280px;
  height: 420px;
  float: left;
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>

