<template>
  <div>
    签约经理:
    <el-input v-model="managerId" class="inline width-250 marginL-10 marginR-5" size="mini" clearable placeholder="签约经理编号"></el-input>
    <el-button class="marginR-5" size="mini" type="success" @click="confirmOpen">
      <div class="paddingLR-10">开通代销</div>
    </el-button>
    <span class="color-gray">
      <i class="el-icon-info"></i> 不填写默认显示指定的账号
    </span>
  </div>
</template>

<script>
export default {
  props: {
    hotelInfo: {
      type: Object
    }
  },
  data() {
    return {
      managerId: ""
    };
  },
  methods: {
    confirmOpen() {
      let isValidId =
        this.managerId &&
        this.managerId.replace(/\s+/g, "") &&
        /^\d+$/.test(this.managerId);
      if (this.managerId && !isValidId) {
        return this.$message.warning("格式不合法，请输入正整数！");
      }
      this.$confirm("是否确认开通代销？", "开通代销", {
        type: "info"
      }).then(confirm => {
        this.submit();
      });
    },
    // 开通代销
    submit() {
      let vm = this;
      return this.$root.commonCall(
        "openOta",
        {
          innId: vm.hotelInfo.fisId,
          contractManagerId: vm.managerId
        },
        {
          success(res) {
            vm.$message.success("开通成功！");
            vm.$emit("refresh");
          },
          failMsg: "开通失败！"
        }
      );
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>
