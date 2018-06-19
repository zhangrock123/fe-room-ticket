<template>
  <el-dialog
    title="图片裁剪"
    :visible.sync="dialogVisible"
    custom-class="common-dialog normal-size"
    :before-close="handleClose">
    <div class="dialog-body">
      <cropper-box @change="cropperChange" :img-url.sync="imgInfo.imgUrl"></cropper-box>
    </div>
    <div slot="footer">
      <el-button size="small" type="success" @click="confirmSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
const CropperBox = () => import("./cropper.vue");
import formatter from "./formatter";

export default {
  props: {
    imgList: {
      type: Array
    },
    type: {
      // 1=酒店图片，2=房型图片
      type: Number,
      required: true
    },
    hotelInfo: {
      type: Object
    },
    roomTypeData: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      imgInfo: {},
      cropperInfo: {}
    };
  },
  components: {
    CropperBox
  },
  methods: {
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交数据
    confirmSubmit() {
      let processParam = {
        ...this.cropperInfo,
        ...this.imgInfo,
        type: this.type,
        seq: this.getMaxSeq(),
        innId: this.hotelInfo ? this.hotelInfo.fisId : "",
        roomTypeId: this.roomTypeData ? this.roomTypeData.roomTypeId : ""
      };
      let checkParamStatus = formatter.CheckParamStatus(processParam);
      if (!checkParamStatus.status) {
        return this.$message.warning(checkParamStatus.msg);
      }
      this.$confirm("是否确认保存图片？", "提示", {
        type: "warning"
      }).then(confirm => {
        this.submit(processParam);
      });
    },
    // 获取队列长度
    getMaxSeq() {
      let maxSeq = 0;
      if (this.imgList && this.imgList.length) {
        this.imgList.forEach(v => {
          maxSeq = v.seq * 1 > maxSeq ? v.seq * 1 : maxSeq;
        });
      }
      return maxSeq + 1;
    },
    // 保存剪切图片
    submit(processParam) {
      let param = formatter.FormatterImageCutModel(processParam);
      let vm = this;
      return this.$root.commonCall("cutHotelOrRoomTypeImg", param, {
        success(res) {
          vm.$message.success("图片保存成功");
          vm.$emit("created", res.data.data);
          vm.dialogVisible = false;
        },
        failMsg: "图片保存失败！"
      });
    },
    // 显示对话框
    showDialog(imgInfo) {
      this.cropperInfo = null;
      this.imgInfo = imgInfo;
      this.dialogVisible = true;
    },
    // 图片裁剪变动
    cropperChange(cropperData) {
      this.cropperInfo = cropperData;
    }
  },
  mounted() {}
};
</script>

<style lang="less" >
.dialog-body {
}
</style>
