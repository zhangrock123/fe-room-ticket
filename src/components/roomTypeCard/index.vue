<template>
  <div class="room-type-card app-flex app-flex-column">
    <i class="close-btn el-icon-error" @click="delRoomType"></i>
    <header @click="uploadCover">
      <div class="empty-cover box-center text-center">
        <i class="icon-plus"></i>
        <div>上传房型图片</div>
      </div>
      <!-- <div class="img-cover coverImg" :style="{'backgroundImage': 'url(http://img.fanqiele.com/oms/img/2016-09-02/77124_1472811508188.png)'}"></div> -->
      <div class="cover-text">修改图片</div>
    </header>
    <section class="col-1">
      <i class="edit-btn el-icon-edit-outline" @click="editRoomType"></i>
      <h3 class="font-14">大床房</h3>
      <div class="app-flex app-flex-center">
        <label class="width-70">
          楼层：
        </label>
        <div class="col-1">
          4层
        </div>
      </div>
      <div class="app-flex app-flex-center">
        <label class="width-70">
          面积：
        </label>
        <div class="col-1">
          4层
        </div>
      </div>
      <div class="app-flex app-flex-center">
        <label class="width-70">
          床型：
        </label>
        <div class="col-1">
          4层
        </div>
      </div>
      <div class="app-flex app-flex-center">
        <label class="width-70">
          床宽：
        </label>
        <div class="col-1">
          4层
        </div>
      </div>
      <div class="app-flex app-flex-center">
        <label class="width-70">
          房型设施：
        </label>
        <div class="col-1">
          4层
        </div>
      </div>
      <div class="app-flex app-flex-center">
        <label class="width-70">
          房型简介：
        </label>
        <div class="col-1">
          4层
        </div>
      </div>
    </section>
    <footer class="text-center">
      <a href="javascript:;" class="recommend-btn actived" @click="recommendRoomType">
        <i>荐</i>
        优先推荐
      </a>
    </footer>
    <edit-room-type-dialog ref="editRoomTypeDialog"></edit-room-type-dialog>
    <image-upload-dialog v-model="imageList" ref="imageUploadDialog"></image-upload-dialog>
  </div>
</template>

<script>
import { EditRoomTypeDialog, ImageUploadDialog } from "@/components";

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      roomData: this.value,
      imageList: []
    };
  },
  watch: {
    roomData() {
      this.$emit("input", this.roomData);
    }
  },
  components: {
    EditRoomTypeDialog,
    ImageUploadDialog
  },
  methods: {
    delRoomType() {
      this.$confirm("该房型配置将会与房型一同被删除！", "提示", {
        type: "warning"
      });
      console.log("delRoomType");
    },
    uploadCover() {
      console.log("uploadCover");
      this.$refs.imageUploadDialog.showDialog();
    },
    editRoomType() {
      console.log("editRoomType");
      this.$refs.editRoomTypeDialog.showDialog();
    },
    recommendRoomType() {
      console.log("recommendRoomType");
    }
  },
  watch: {
    imageList() {
      console.log(this.imageList);
    }
  },
  mounted() {
    this.imageList = [
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469057485.png",
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469063016.png",
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469082074.png",
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469099045.png",
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469106817.png",
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469162823.png",
      "http://img.fanqiele.com/oms/img/2016-08-29/77124_1472469117034.png"
    ];
  }
};
</script>

<style lang="less" scoped>
a.recommend-btn {
  color: #333;
  text-decoration: none;
  i {
    display: inline-block;
    font-style: normal;
    background-color: #b1b1b3;
    color: #fff;
    font-size: 12px;
    padding: 0 3px;
    border-radius: 3px;
  }
  &.actived {
    color: #67c23a;
    i {
      background-color: #67c23a;
      color: #fff;
    }
  }
}
.room-type-card {
  position: relative;
  border: 1px solid #ccc;
  &:hover {
    .close-btn {
      display: block;
    }
  }
  .close-btn {
    display: none;
    cursor: pointer;
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 20px;
    z-index: 5;
    background-color: #fff;
    color: #999;
    &:hover {
      color: #f56c6c;
      transition: all 0.3s ease;
    }
  }
  > header {
    height: 190px;
    margin: 5px;
    position: relative;
    background-color: #f9f9f9;
    cursor: pointer;
    overflow: hidden;
    .empty-cover {
      color: #b1b1b1;
      * {
        font-size: 14px;
      }
      i {
        font-size: 40px;
        + * {
          margin-top: 10px;
        }
      }
    }
    .img-cover {
      width: 100%;
      height: inherit;
    }
    .cover-text {
      position: absolute;
      left: 0;
      bottom: -30px;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      font-size: 12px;
      transition: bottom 300ms;
    }
    &:hover {
      .cover-text {
        bottom: 0;
      }
    }
  }
  > section {
    position: relative;
    margin: 5px 10px;
    .edit-btn {
      display: none;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      color: #999;
      &:hover {
        color: #67c23a;
        transition: all 0.3s ease;
      }
    }
    &:hover {
      .edit-btn {
        display: block;
      }
    }
  }
  > footer {
    padding: 10px 0;
    background-color: #f9f9f9;
  }
}
</style>
