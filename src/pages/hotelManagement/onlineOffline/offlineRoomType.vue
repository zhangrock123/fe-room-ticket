<template>
  <div>
    <el-alert
      title="新增房型,请到“房型管理”中操作"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>
    <table class="table center marginT-10">
      <thead>
        <tr>
          <th width="60%">房型名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody v-if="roomTypeData.offline && roomTypeData.offline.length">
        <tr v-for="(roomType, $roomTypeIndex) in roomTypeData.offline" :key="$roomTypeIndex">
          <td>
            {{roomType.roomTypeName}}
          </td>
          <td>
            <el-button class="no-padding" size="mini" plain @click="onlineRoomType(roomType)">
              <span class="font-12">提交上架审核</span>
            </el-button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="2">暂无房型数据！</td>
        </tr>
      </tbody>
    </table>
    <online-room-type-dialog :hotel-info="hotelInfo" :room-type-info="roomTypeData" @refresh="refreshRoomType" ref="onlineRoomTypeDialog"></online-room-type-dialog>
  </div>
</template>

<script>
import { OnlineRoomTypeDialog } from "@/components";
export default {
  props: {
    hotelInfo: {
      type: Object,
      required: true
    },
    roomTypeData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      checkedRoomType: {}
    };
  },
  components: {
    OnlineRoomTypeDialog
  },
  methods: {
    onlineRoomType(roomType) {
      this.$refs.onlineRoomTypeDialog.showDialog(roomType);
    },
    refreshRoomType() {
      this.$emit("refresh");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
