<template>
  <div class="drag-table-box app-flex">
    <div class="drag-table-left">
      <header class="drag-table-header">
        <div class="border-bottom">
          <date-inline-picker v-model="date" :day-range="dayRange"></date-inline-picker>
        </div>
      </header>
      <section class="drag-table-section" :style="{'maxHeight': uiSettings.contentMaxHeight+'px'}">
        <ul class="name-box" :style="{'transform': 'translate(0,'+uiSettings.tableSiderTop+')'}">
          <li v-if="dataList.length" class="name-item" :class="{'actived': $roomTypeIndex==actived.y}" v-for="(roomType, $roomTypeIndex) in dataList" :key="$roomTypeIndex">
            <slot name="left" :data="roomType"></slot>
          </li>
        </ul>
      </section>
    </div>
    <div class="drag-table-middle" v-show="displayAction">
      <header>
        <div class="border-bottom">
          <div class="box-center text-center">
            {{actionTitle}}
          </div>
        </div>
      </header>
      <section class="drag-table-section" :style="{'maxHeight': uiSettings.contentMaxHeight+'px'}">
        <ul class="name-box" :style="{'transform': 'translate(0,'+uiSettings.tableSiderTop+')'}">
          <li v-if="dataList.length" class="name-item" v-for="(roomType, $roomTypeIndex) in dataList" :key="$roomTypeIndex">
            <slot name="middle-section" :data="roomType"></slot>
          </li>
        </ul>
      </section>
    </div>
    <div class="drag-table-right col-1">
      <header class="drag-table-header" :style="{'transform': 'translate('+uiSettings.tableHeaderLeft+', 0)'}">
        <ul class="column-box" v-if="dateList.length">
          <li class="column-item" :class="{'actived': $dateIndex==actived.x}" v-for="(date, $dateIndex) in dateList" :key="$dateIndex">
            <slot name="right-header" :data="date"></slot>
          </li>
        </ul>
      </header>
      <section class="table-body drag-table-section" ref="tableBody" :style="{'maxHeight': uiSettings.contentMaxHeight+'px'}">
        <div v-if="dataList.length" class="item-box" v-for="(roomType, $roomTypeIndex) in dataList" :key="$roomTypeIndex">
          <ul class="column-box">
            <li class="column-item" :class="{'actived': $roomIndex==actived.x && $roomTypeIndex == actived.y}" v-for="(room, $roomIndex) in roomType.roomDetail" :key="$roomIndex" @mouseenter="itemEnter($roomIndex,$roomTypeIndex)" @mouseleave="itemLeave($roomIndex,$roomTypeIndex)">
              <slot name="right-section" :data="room"></slot>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { DateInlinePicker } from "@/components";

export default {
  props: {
    startDate: {
      type: Date
    },
    dateList: {
      type: Array,
      required: true
    },
    dataList: {
      type: Array,
      required: true
    },
    dayRange: {
      type: Number,
      default: 20
    },
    displayAction: {
      type: Boolean,
      default: false
    },
    actionTitle:{
      type: String,
      default: '操作'
    }
  },
  data() {
    return {
      date: this.startDate,
      uiSettings: {
        contentMaxHeight: 600,
        tableHeaderLeft: 0,
        tableSiderTop: 0
      },
      actived: {
        x: -1,
        y: -1
      }
    };
  },
  watch: {
    date() {
      this.resetScrollPosition();
      this.$emit("change", this.date);
    }
  },
  components: {
    DateInlinePicker
  },
  methods: {
    // 获取当前时间
    getCurDate(date) {
      let now = date || new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
    // 计算滑动位置
    calcScroll(e) {
      var $target = e.target;
      this.uiSettings.tableHeaderLeft = "-" + $target.scrollLeft + "px";
      this.uiSettings.tableSiderTop = "-" + $target.scrollTop + "px";
    },
    // 复位滑动位置
    resetScrollPosition() {
      this.uiSettings.tableHeaderLeft = 0;
      this.uiSettings.tableSiderTop = 0;
      this.$refs.tableBody.scrollTop = 0;
      this.$refs.tableBody.scrollLeft = 0;
    },
    // item项的鼠标进入事件
    itemEnter(x, y) {
      this.actived = {
        x,
        y
      };
    },
    // item项的鼠标移出事件
    itemLeave(x, y) {
      this.actived = {
        x: -1,
        y: -1
      };
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.$refs.tableBody.onscroll = this.calcScroll;
    });
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@color_gray: #e4e4e4;
@bg_color: #f9faf9;

.drag-table-box {
  * {
    box-sizing: border-box;
  }
  border: 1px solid @color_gray;
  .drag-table-left {
    width: 200px;
    border-right: 1px solid @color_gray;
    background-color: @bg_color;
  }
  .drag-table-middle {
    width: 100px;
    background-color: @bg_color;
    border-right: 1px solid @color_gray;
    > header {
      div {
      }
    }
  }
  .drag-table-right {
    overflow: hidden;
    .drag-table-header .column-item {
      background-color: @bg_color;
    }
  }
  .drag-table-header {
    height: 50px;
  }
  .drag-table-section {
    overflow: hidden;
    &.table-body {
      overflow: scroll;
    }
  }
  .border-bottom {
    position: relative;
    height: 50px;
    border-bottom: 1px solid @color_gray;
  }
  .item-box {
    height: 50px;
    + .item-box {
      /* border-top: 1px solid @color_gray; */
    }
  }
  .column-box {
    height: 100%;
    white-space: nowrap;
    font-size: 0;

    .column-item {
      height: inherit;
      position: relative;
      width: 100px;
      display: inline-block;
      border-bottom: 1px solid @color_gray;
      &.actived {
        background-color: #fdf5e6;
      }
      + .column-item {
        border-left: 1px solid @color_gray;
      }
    }
  }
  .name-box {
    font-size: 0;
    .name-item {
      position: relative;
      height: 50px;
      box-sizing: border-box;
      border-bottom: 1px solid @color_gray;
      &.actived {
        background-color: #fdf5e6;
      }
      + .name-item {
        /* border-top: 1px solid @color_gray; */
      }
    }
  }
}
</style>

