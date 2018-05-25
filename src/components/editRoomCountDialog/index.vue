<template>
  <el-dialog
  title="批量修改房量"
  :visible.sync="dialogVisible"
  custom-class="common-dialog normal-size"
  :before-close="handleClose">
  <div class="dialog-body">
    <ul class="item-box">
      <li class="item-cell" v-for="(item, $itemIndex) in dataList" :key="$itemIndex">
        <div class="app-flex app-flex-full app-flex-center">
          <div class="item-name">{{item.name}}</div>
          <div class="col-1">
            <el-input class="inline" size="mini" placeholder="输入数量" type="number" v-model="item.count" clearable></el-input>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div slot="footer">
    <el-button size="small" type="success" @click="submit">确认</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataList: this.data
    };
  },
  methods: {
    // 显示对话框
    showDialog() {
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交
    submit() {
      this.dialogVisible = false;
      console.log(this.dataList);
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-body {
  min-height: 200px;
  .item-box {
    border: 1px solid #eee;
    .item-cell {
      padding: 5px 10px;
      + * {
        border-top: 1px solid #eee;
      }
      .item-name {
        width: 200px;
      }
      &:hover {
        background-color: #fafafa;
      }
    }
  }
}
</style>

