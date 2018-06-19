<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  width="40%">
  <div class="dialog-body">
    <header class="marginB-10" v-if="keywordColumn">
      <el-input class="inline" size="mini" v-model="keyword" :placeholder="placeholder"></el-input>
      <el-button type="success" size="mini" @click="doSearch">搜索</el-button>
    </header>
    <table class="table center">
      <thead>
        <tr>
          <th v-for="(item, $itemIndex) in column" :key="$itemIndex" :width="item.width">
            {{item.title}}
          </th>
        </tr>
      </thead>
      <tbody v-show="dataList.length">
        <tr class="pointer" v-for="(data, $dataIndex) in dataList" :key="$dataIndex" @dblclick="selectItem(data)">
          <td v-for="(item, $itemIndex) in column" :key="$itemIndex">
            {{data[item.column]}}
          </td>
        </tr>
      </tbody>
      <tbody v-show="!dataList.length">
        <tr>
          <td :colspan="column.length">
            <div class="color-gray padding-10">
              <i class="icon-exclamation-circle"></i> 暂无数据！
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: "提示"
    },
    // 输入框默认文字
    placeholder: {
      type: String,
      default: "输入搜索关键字"
    },
    // 表格标题和字段配置
    column: {
      type: Array,
      require: true
    },
    // 调用的service的方法
    apiService: {
      type: Function
    },
    // 是否弹框显示就执行搜索
    search: {
      type: Boolean,
      default: false
    },
    // 搜索关键字的服务端字段名称
    keywordColumn: {
      type: String
    },
    // 默认传参
    baseParam: {
      type: Object,
      default() {
        return {};
      }
    },
    // 数据成功返回后的处理
    successExpr: {
      type: Function
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      keyword: "酒店"
    };
  },
  methods: {
    //显示对话框
    showDialog() {
      this.initData();
      this.dialogVisible = true;
    },
    //隐藏对话框
    hideDialog() {
      this.dialogVisible = false;
    },
    // 初始化
    initData() {
      this.dataList = [];
      this.keyword = "";
      this.search && this.doSearch();
    },
    // 执行查询
    doSearch() {
      let param = this.baseParam || {};
      if (this.keywordColumn) {
        param[this.keywordColumn] = this.keyword;
      }
      this.dataList = [];
      this.$loading.open();
      this.apiService(param)
        .then(
          res => {
            if (res.success) {
              if (this.successExpr) {
                this.dataList = this.successExpr(res);
              } else {
                this.dataList = res.data.data || [];
              }
            } else {
              this.$message.warning(res.data.message || "数据查询失败！");
            }
          },
          err => {
            this.$message.error("服务器错误！");
          }
        )
        .finally(() => {
          this.$loading.close();
        });
    },
    // 双击选择某个数据之后执行回调，且关闭弹窗
    selectItem(data) {
      if (!data) {
        return;
      }
      this.$emit("change", data);
      this.hideDialog();
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>

