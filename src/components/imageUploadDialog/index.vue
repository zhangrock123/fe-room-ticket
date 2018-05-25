<template>
<el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  custom-class="common-dialog normal-size"
  :before-close="handleClose">
  <div class="dialog-body">
    <header class="app-flex app-flex-center">
      <div>
        <span v-show="isEditMode">
          <i class="icon-exclamation-circle"></i>
          直接拖动图片可调整顺序，第一张为封面图
        </span>
      </div>
      <div class="col-1 text-right">
        <el-button v-show="!isEditMode" size="mini" @click="doImageOrder">
          <i class="icon-arrows"></i>
          图片排序
        </el-button>
        <el-button v-show="isEditMode" type="success" size="mini" @click="saveImageOrder">
          <i class="icon-check-circle"></i>
          保存排序
        </el-button>
        <el-button v-show="isEditMode" type="info" plain size="mini" @click="isEditMode=false">
          <i class="icon-times-circle"></i>
          退出排序
        </el-button>
      </div>
    </header>
    <section class="marginT-10">
      <ul class="image-list-box" v-show="isEditMode">
        <li
          class="image-drag-item"
          v-for="(img, $imgIndex) in orderImgList"
          :key="$imgIndex"
          v-dragging="{ item: img, list: orderImgList, group: 'img' }">
          <div class="coverImg" :style="{'backgroundImage': `url(${img})`}"></div>
        </li>
      </ul>
      <ul class="image-list-box" v-show="!isEditMode">
        <li
          class="image-drag-item show-cover"
          v-for="(img, $imgIndex) in imgList"
          :key="img">
          <div class="coverImg" :style="{'backgroundImage': `url(${img})`}"></div>
          <div class="cover-action">
            <a href="javascript:;" @click="deleteImage(img)">
              <i class="icon-remove"></i>
              删除
            </a>
          </div>
        </li>
        <li class="image-upload-item">
          <el-upload
            class="box-center"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-upload"></i>
          </el-upload>
        </li>
      </ul>
    </section>
  </div>
  <div slot="footer" class="text-left">
    房型图片最大不超过2M，推荐图片尺寸 640：400 ; 请保证图片无水印、高质量、合法性。
  </div>
</el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: "房型图片"
    }
  },
  data() {
    return {
      imgList: this.value,
      dialogVisible: false,
      isEditMode: false,
      orderImgList: []
    };
  },
  watch: {
    imgList() {
      this.$emit("input", this.imgList);
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 确认提交
    saveImageOrder() {
      this.imgList = [...this.orderImgList];
      this.isEditMode = false;
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const limitFileTypeList = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif"
      ];
      const limitSize = 2;
      const isLimitFileType = limitFileTypeList.indexOf(file.type) != -1;
      const isLimitSize = file.size / 1024 / 1024 < limitSize;

      if (!isLimitFileType) {
        this.$message.error("上传图片格式不合法!");
      }
      if (!isLimitSize) {
        this.$message.error(`上传图片大小不能超过 ${limitSize}MB!`);
      }
      return isLimitFileType && isLimitSize;
    },
    doImageOrder() {
      this.orderImgList = [...this.imgList];
      this.isEditMode = true;
    },
    deleteImage(img) {
      setTimeout(() => {
        this.$confirm("是否确认删除该图片？");
      }, 100);
    }
  },
  mounted() {
    this.$dragging.$on("dragged", ({ value }) => {
      // console.log(value.item);
      // console.log(value.list);
      // console.log(value.otherData);
    });
    this.$dragging.$on("dragend", () => {});
  }
};
</script>

<style lang="less" scoped>
@img_width: 160px;
@img_height: 100px;
.dialog-body {
  min-height: 200px;
}

.image-list-box {
  font-size: 0;
}

.image-upload-item,
.image-drag-item {
  width: @img_width;
  height: @img_height;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.image-drag-item {
  border: 1px solid #e0e0e0;
  &.show-cover:first-child {
    &:before {
      content: "封面";
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #f56c6c;
      color: #fff;
      padding: 2px 6px;
    }
  }
  .coverImg {
    width: @img_width;
    height: @img_height;
  }
  .cover-action {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: rgba(0, 0, 0, 0);
    color: #fff;
    text-align: right;
    font-size: 12px;
    z-index: 5;
    opacity: 0;
    transition: all 0.5s ease;
    a {
      display: inline-block;
      text-decoration: none;
      color: #fff;
      margin-right: 5px;
      transition: all 0.3s ease;
      &:hover {
        color: #f00;
        transition: all 0.3s ease;
      }
    }
  }
  &:hover {
    .cover-action {
      opacity: 1;
      background: rgba(0, 0, 0, 0.5);
      transition: all 0.5s ease;
    }
  }
}
.image-upload-item {
  border: 1px dashed #e0e0e0;
  i {
    width: @img_width;
    height: @img_height;
    font-size: 34px;
    color: #c0c4cc;
    line-height: @img_height;
  }
  &:hover {
    border: 1px dashed #409eff;
    background-color: #ecf5ff;
    i {
      color: #409eff;
    }
  }
}
.item-full {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
