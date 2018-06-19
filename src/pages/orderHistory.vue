<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/order'}">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>下载中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
        :data="dataList"
        border
        style="width: 100%;">
        <el-table-column
          prop="fileName"
          label="文件名">
        </el-table-column>
        <el-table-column
          prop="lastModified"
          label="最后修改时间">
        </el-table-column>
        <el-table-column
        width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="download(scope.row)">
              <span class="font-12"><i class="el-icon-download"></i> 下载</span>
            </el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: []
    };
  },
  methods: {
    // 获取下载列表
    getOrderHistory() {
      let vm = this;
      return this.$root.commonCall(
        "getExportHistoryList",
        {},
        {
          success(res) {
            vm.dataList = res.data.result || [];
          },
          failMsg: "获取下载数据失败！"
        }
      );
    },
    // 下载文档
    download(data) {
      window.open(data.path);
    }
  },
  mounted() {
    this.getOrderHistory();
  }
};
</script>

<style lang="less" scoped>
</style>
