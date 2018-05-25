<template>
  <div class="room-type-box">
    <header class="font-12">
      房型信息使用于第三方卖房渠道对时提供的房型相关资料，请确保房信息的真实性、完整！
    </header>
    <div class="marginTB-10">
      <el-button size="mini" type="success" @click="addNewRoomType">
        <i class="icon-plus-circle"></i> 新建房型
      </el-button>
    </div>
    <section>
      <div class="room-type-card-box">
        <div class="room-type-card" v-for="(room, $roomIndex) in roomList" :key="$roomIndex">
            <room-type-card v-model="roomList[$roomIndex]"></room-type-card>
        </div>
      </div>
    </section>
    <edit-room-type-dialog ref="editRoomTypeDialog"></edit-room-type-dialog>
  </div>
</template>

<script>
import { RoomTypeCard, EditRoomTypeDialog } from "@/components";
export default {
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
    addNewRoomType() {
      console.log("addNewRoomType");
      this.$refs.editRoomTypeDialog.showDialog();
    },
    getRoomList() {
      this.roomList = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
    }
  },
  mounted() {
    this.getRoomList();
  }
};
</script>
<style lang="less" scoped>
.room-type-box {
  > header {
    padding: 8px 10px;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
  }
}
.room-type-card-box:after {
  content: "";
  display: block;
  width: 1px;
  height: 1px;
  clear: both;
}
.room-type-card {
  width: 280px;
  height: 400px;
  float: left;
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>

