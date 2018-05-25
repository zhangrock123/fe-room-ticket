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
      <tbody>
        <tr v-for="(roomType, $roomTypeIndex) in roomTypeList" :key="$roomTypeIndex">
          <td>
            {{roomType.name}}
          </td>
          <td>
            <el-button class="no-padding" size="mini" plain @click="onlineRoomType(roomType)">
              <span class="font-12">提交上架审核</span>
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <online-room-type-dialog ref="onlineRoomTypeDialog"></online-room-type-dialog>
  </div>
</template>

<script>
import { OnlineRoomTypeDialog } from "@/components";
export default {
  data() {
    return {
      roomTypeList: [
        {
          id: 1,
          name: "大床房"
        },
        {
          id: 2,
          name: "标准间"
        },
        {
          id: 3,
          name: "豪华大床房"
        }
      ]
    };
  },
  components: {
    OnlineRoomTypeDialog
  },
  methods: {
    onlineRoomType() {
      this.$refs.onlineRoomTypeDialog.showDialog();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
