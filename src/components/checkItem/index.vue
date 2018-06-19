<template>
  <ul class="option-box">
    <li>
      <el-checkbox v-model="checkAll" @change="setCheckAll">
        <div class="font-12">全选</div>
      </el-checkbox>
    </li>
    <li v-for="(option, $optionIndex) in optionList" :key="$optionIndex">
      <el-checkbox v-model="option.checked" @change="setChecked">
        <div class="font-12">{{option.name}}</div>
      </el-checkbox>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkAll: false,
      optionList: this.value
    };
  },
  watch: {
    value() {
      this.optionList = this.value;
      this.checkAll = false;
    }
  },
  methods: {
    // 全选
    setCheckAll() {
      this.optionList.forEach(v => {
        v.checked = this.checkAll;
      });
      this.emit();
    },
    // 选择某个
    setChecked() {
      let checkAll = true;
      this.optionList.some(v => {
        if (!v.checked) {
          checkAll = false;
          return true;
        }
      });
      this.checkAll = checkAll;
      this.emit();
    },
    emit() {
      let checkedItems = [...this.optionList.filter(v => v.checked)];
      this.$emit("input", this.optionList);
      this.$emit("change", checkedItems);
    }
  }
};
</script>


<style lang="less" scoped>
.option-box {
  width: 200px;
  overflow: hidden;
  li {
    width: inherit;
    margin-bottom: 5px;
  }
}
</style>
