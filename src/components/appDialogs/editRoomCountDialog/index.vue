<template>
  <el-dialog
  title="修改房券数量"
  :visible.sync="dialogVisible"
  custom-class="common-dialog small-size"
  :before-close="handleClose">
  <div class="dialog-body">
    <el-input class="box-center" size="small" placeholder="输入房券数量" type="number" v-model="count" clearable></el-input>
  </div>
  <div slot="footer">
    <el-button size="small" type="success" @click="confirmSubmit">保存</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      roomType: {},
      count: ""
    };
  },
  methods: {
    // 显示对话框
    showDialog(roomTypeData) {
      this.roomType = roomTypeData;
      this.count = this.roomType.ticketNumber || "";
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 提示保存
    confirmSubmit() {
      if (isNaN(this.count) || this.count * 1 <= 0) {
        return this.$message.warning("输入房券数量不合法！");
      }
      this.$confirm("是否确认保存？", "提示", {
        type: "warning"
      }).then(confirm => {
        this.submit();
      });
    },
    // 确认提交
    submit() {
      let vm = this;
      return this.$root.commonCall(
        "editRoomTicketCount",
        {
          innId: vm.roomType.innId,
          accountId: vm.roomType.accountId,
          otaRoomId: vm.roomType.otaRoomTypeId,
          number: vm.count
        },
        {
          success(res) {
            vm.$message.success("保存成功！");
            vm.dialogVisible = false;
            vm.$emit("reset", {
              roomTypeId: vm.roomType.roomTypeId,
              count: vm.count
            });
          },
          failMsg: "保存失败！"
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-body {
  height: 80px;
  position: relative;
}
</style>

