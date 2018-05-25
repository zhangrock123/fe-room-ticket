<template>
  <ul class="week-box">
    <li v-for="(week, $weekIndex) in weekOptionList" :key="$weekIndex">
      <span @click="setWeekChecked($weekIndex)" :class="{'checked': week.checked}">{{week.name}}</span>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      weekOptionList: []
    };
  },
  methods: {
    // 初始化星期数据
    initWeekOptionList() {
      let weekOptionList = [];
      let weekStr = "一二三四五六日";
      weekStr.split("").forEach(v => {
        weekOptionList.push({
          name: `周${v}`,
          checked: false
        });
      });
      weekOptionList.unshift({
        name: "全选",
        checked: false
      });
      this.weekOptionList = weekOptionList;
    },
    // 星期数据选中（weekIndex 0 全选/反选 1 单选）
    setWeekChecked(weekIndex) {
      this.weekOptionList[weekIndex].checked = !this.weekOptionList[weekIndex]
        .checked;
      if (weekIndex == 0) {
        this.weekOptionList.forEach((v, i) => {
          if (!i) {
            return;
          }
          v.checked = this.weekOptionList[0].checked;
        });
      } else {
        this.weekOptionList[0].checked = !this.weekOptionList.some((v, i) => {
          return i && !v.checked;
        });
      }
      this.$emit("change", this.weekOptionList);
    }
  },
  mounted() {
    this.initWeekOptionList();
  }
};
</script>

<style lang="less" scoped>
.week-box {
  li {
    display: inline-block;
    + li {
      margin-left: 5px;
    }
    span {
      cursor: pointer;
      font-size: 12px;
      display: inline-block;
      padding: 2px 8px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      &.checked {
        border: 1px solid #67c23a;
        background-color: #67c23a;
        color: #fff;
      }
    }
  }
}
</style>

