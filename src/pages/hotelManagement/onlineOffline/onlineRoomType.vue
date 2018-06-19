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
          <th width="60%">房型名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody v-if="roomTypeData.online && roomTypeData.online.length">
        <tr v-for="(roomType, $roomTypeIndex) in roomTypeData.online" :key="$roomTypeIndex">
          <td>
            {{roomType.roomTypeName}}
          </td>
          <td>
            <el-button class="no-padding" size="mini" plain disabled="">
              <span class="font-12">下架房型</span>
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
  </div>
</template>

<script>
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
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>
