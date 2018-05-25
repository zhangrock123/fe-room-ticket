<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  width="40%">
  <div class="dialog-body">
    <header class="marginB-10">
      <el-input class="inline" size="mini" placeholder="输入搜索关键字"></el-input>
      <el-button type="success" size="mini">搜索</el-button>
    </header>
    <table class="table center">
      <thead>
        <tr>
          <th v-for="(item, $itemIndex) in column" :key="$itemIndex">
            {{item.title}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="pointer" v-for="(data, $dataIndex) in dataList" :key="$dataIndex" @dblclick="selectItem(data)">
          <td v-for="(item, $itemIndex) in column" :key="$itemIndex" :width="item.width">
            {{data[item.column]}}
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
    title: {
      type: String,
      default: "提示"
    },
    column: {
      type: Array,
      require: true
    },
    service: {
      type: Function
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataList: []
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
    initData() {
      this.dataList = [
        {
          id: 1,
          name: "本地大床房"
        },
        {
          id: 2,
          name: "本地单人房"
        }
      ];
    },
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

