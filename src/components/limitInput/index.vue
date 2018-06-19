<template>
  <div>
    <el-input
      v-popover:popover
      type="textarea"
      :rows="row"
      resize="none"
      :placeholder="placeholder"
      :maxlength="count"
      v-model="inputValue">
    </el-input>
    <el-popover
      ref="popover"
      popper-class="tips"
      :placement="placement"
      trigger="focus"
      :content="`还可输入${existCount}字`">
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Number,
      default: 2
    },
    placeholder: {
      type: String
    },
    placement: {
      type: String,
      default: "top"
    },
    count: {
      type: Number,
      default: 200
    },
    value: {
      type: String,
      required: true
    }
  },
  watch: {
    value() {
      this.inputValue = this.value;
    },
    inputValue() {
      this.$emit("input", this.inputValue);
    }
  },
  computed: {
    existCount() {
      return this.count - this.inputValue.length;
    }
  },
  data() {
    return {
      inputValue: this.value
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>
