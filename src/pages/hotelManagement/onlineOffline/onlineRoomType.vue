<template>
  <div>
    <el-alert
      title="若要下架房型,请通知相关运营人操作下架处理"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>
    <table class="table center marginT-10">
      <thead>
        <tr>
          <th width="50%">房型名称</th>
          <th width="25%">房间数</th>
          <th>房券数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(roomType, $roomTypeIndex) in roomTypeList" :key="$roomTypeIndex">
          <td>
            {{roomType.name}}
          </td>
          <td>
            {{roomType.count}}
          </td>
          <td>
            {{roomType.coupon}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomTypeList: [
        {
          id: 1,
          name: "大床房",
          count: 10,
          coupon: 5
        },
        {
          id: 2,
          name: "标准间",
          count: 1,
          coupon: 2
        },
        {
          id: 3,
          name: "豪华大床房",
          count: 7,
          coupon: 3
        }
      ]
    };
  },
  methods: {
    onlineRoomType() {}
  }
};
</script>

<style lang="less" scoped>
</style>
