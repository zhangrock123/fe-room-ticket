<template>
  <div class="baidu-map-container" :style="{'height': `${height}px`}">
    <div class="mask" v-show="isMask" @click="hideMask"><span class="box-center font-16">点击可释放地图</span></div>
    <div id="baidu-map" :style="{'height': `${height}px`}"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: [121.7, 31.19],
      required: true
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      lonLat: this.value,
      isMask: true
    };
  },
  watch: {
    lonLat() {
      this.$emit("input", this.lonLat);
    }
  },
  methods: {
    hideMask() {
      this.isMask = false;
    },
    // 百度地图搜索
    search(fullAddress) {
      this.renderBaiduMap(fullAddress);
    },
    // 渲染百度地图
    renderBaiduMap(searchKeyWord) {
      let map = new BMap.Map("baidu-map");
      let mapSearcher = new BMap.LocalSearch(map, {
        renderOptions: { map: map }
      });
      searchKeyWord && mapSearcher.search(searchKeyWord);
      let point = new BMap.Point(...this.lonLat); // 创建点坐标
      //设置地图中心
      map.centerAndZoom(point, 13);
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addControl(new BMap.MapTypeControl());
      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用

      //点击地图 记录当前坐标，进行查询（拖拽、放大缩小地图不会触发）
      map.addEventListener("click", e => {
        let lngLat = e.point;
        [...this.lonLat] = [lngLat.lng, lngLat.lat];
        this.renderBaiduMap();
      });
      //创建标注，为要查询的地方对应的经纬度--可不加：,{icon:myIcon}
      let marker = new BMap.Marker(new BMap.Point(...this.lonLat));
      map.addOverlay(marker);
      marker.enableDragging(); //标注可拖拽
      marker.addEventListener("dragend", e => {
        let lngLat = e.point;
        [...this.lonLat] = [lngLat.lng, lngLat.lat];
      });
      //设置搜索完成的回调函数
      mapSearcher.setSearchCompleteCallback(searchResult => {
        try {
          let lngLat = searchResult.getPoi(0).point;
          [...this.lonLat] = [lngLat.lng, lngLat.lat];
          this.renderBaiduMap();
        } catch (exception) {
          this.$alert("未查询到该地址，请尝试手动标注！");
        }
      });
    }
  },
  mounted() {
    this.renderBaiduMap();
  }
};
</script>

 <style lang="less" scoped>
.baidu-map-container {
  position: relative;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    z-index: 2;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      color: #fff;
      transition: all 0.3s ease;
    }
  }
}
</style>
