<template>
  <div class="date-inline-picker-box app-flex app-flex-full app-flex-center">
    <div class="date-inline-picker-btn">
      <a href="javascript:;" @click="changeDate('prev')">
        <i class="icon-angle-left"></i>
      </a>
    </div>
    <div class="col-1">
      <el-date-picker
        v-model="date"
        size="small"
        type="date"
        :clearable="false"
        :editable="false"
        class="no-padding no-icon text-center inline"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="date-inline-picker-btn">
      <a href="javascript:;" @click="changeDate('next')">
        <i class="icon-angle-right"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Date,
      required: true
    },
    dayRange: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      date: this.value
    };
  },
  watch: {
    date(v) {
      this.$emit("input", v);
    }
  },
  methods: {
    changeDate(action) {
      let diffTime =
        3600 * 1000 * 24 * this.dayRange * (action == "prev" ? -1 : 1);
      this.date = new Date(this.date.setTime(this.date.getTime() + diffTime));
    }
  }
};
</script>
<style lang="less" scoped>
.date-inline-picker-btn {
  a {
    display: inline-block;
    padding: 0 10px;
    text-decoration: none;
    color: #8a8a8a;
    i {
      font-size: 20px;
    }
  }
}
</style>

