<template>
  <div class="room-type-card app-flex app-flex-column">
    <i class="close-btn el-icon-error" @click="delRoomType"></i>
    <header @click="uploadCover">
      <div v-if="!imgCover" class="empty-cover box-center text-center">
        <i class="icon-plus"></i>
        <div>上传房型图片</div>
      </div>
      <div v-else class="img-cover coverImg" :style="{'backgroundImage': `url(${imgCover})`}"></div>
      <div class="cover-text">修改图片</div>
    </header>
    <section class="col-1">
      <i class="edit-btn el-icon-edit-outline" @click="editRoomType"></i>
      <h3 class="font-14">{{roomData.roomTypeName}}</h3>
      <div class="info-column app-flex app-flex-center">
        <label class="width-70">
          楼层：
        </label>
        <div class="col-1">
          {{roomData.floorNum}} 层
        </div>
      </div>
      <div class="info-column app-flex app-flex-center">
        <label class="width-70">
          面积：
        </label>
        <div class="col-1">
          {{roomData.roomArea}} 平方米
        </div>
      </div>
      <div class="info-column app-flex app-flex-center">
        <label class="width-70">
          床型：
        </label>
        <div class="col-1">
          {{ bedTypeName }}
        </div>
      </div>
      <div class="info-column app-flex app-flex-center">
        <label class="width-70">
          床宽：
        </label>
        <div class="col-1">
          {{roomData.bedWid}} 厘米
        </div>
      </div>
      <div class="info-column app-flex app-flex-center">
        <label class="width-70">
          房型设施：
        </label>
        <div class="col-1">
          {{ facilityName }}
        </div>
      </div>
      <div class="info-column app-flex">
        <label class="width-70">
          房型简介：
        </label>
        <div class="col-1 breakWord">
          {{roomData.roomInfo | wordLimit(56)}}
        </div>
      </div>
    </section>
    <footer class="text-center">
      <a href="javascript:;" class="recommend-btn" :class="{'actived': !!roomData.recommend}" @click="recommendRoomType">
        <i>荐</i>
        优先推荐
      </a>
    </footer>
    <edit-room-type-dialog @change="change" :hotel-id="roomData.innId" title="编辑房型" ref="editRoomTypeDialog"></edit-room-type-dialog>
    <image-upload-dialog @update="updateRoomTypeImg" v-model="roomData.imgList" :room-type-data="roomData" :hotel-info="hotelInfo" :type="2" ref="imageUploadDialog"></image-upload-dialog>
  </div>
</template>

<script>
import { EditRoomTypeDialog, ImageUploadDialog } from "@/components";
import { mapActions } from "vuex";

export default {
  props: {
    roomData: {
      type: Object,
      required: true
    },
    hotelInfo: {
      type: Object
    }
  },
  data() {
    return {
      options: {
        bedType: [],
        facilityList: []
      }
    };
  },
  computed: {
    // 根据床型值获取床型名称
    bedTypeName() {
      let res = "";
      let val = this.roomData.bedType;
      if (val) {
        res = this.options.bedType.filter(v => v.value == val);
        res && res.length && (res = res[0].name);
      }
      return res;
    },
    // 根据设施值获取设施名称
    facilityName() {
      let res = [];
      let facilityList = this.roomData.facilities.split(",");
      if (!facilityList.length) {
        return res;
      }
      facilityList.forEach(v => {
        this.options.facilityList.some(f => {
          return f.value == v && res.push(f.name);
        });
      });
      return res.join(",");
    },
    imgCover() {
      let res = "";
      if (
        this.roomData.imgList &&
        this.roomData.imgList.length &&
        this.roomData.imgList[0].imgUrl
      ) {
        res = this.roomData.imgList[0].imgUrl;
      }
      return res;
    }
  },
  components: {
    EditRoomTypeDialog,
    ImageUploadDialog
  },
  methods: {
    ...mapActions(["getDictOptionAction"]),
    // 房型删除
    delRoomType() {
      let vm = this;
      this.$confirm("该房型配置将会与房型一同被删除！", "提示", {
        type: "warning"
      }).then(confirm => {
        this.$root.commonCall(
          "removeHotelRoomType",
          {
            roomTypeId: vm.roomData.roomTypeId,
            innId: vm.roomData.innId
          },
          {
            success(res) {
              vm.$message.success("删除房型成功！");
              vm.change();
            },
            failMsg: "删除房型失败！"
          }
        );
      });
    },
    // 点击弹出房型图片编辑对话框
    uploadCover() {
      this.$refs.imageUploadDialog.showDialog();
    },
    // 点击弹出房型信息编辑对话框
    editRoomType() {
      this.$refs.editRoomTypeDialog.showDialog(this.roomData);
    },
    // 优先推荐
    recommendRoomType() {
      let param = {
        roomTypeId: this.roomData.roomTypeId,
        recommend: !this.roomData.recommend ? 1 : 0
      };
      let vm = this;
      return this.$root.commonCall("setRoomTypeRecommendStatus", param, {
        success(res) {
          vm.$message.success("设置成功！");
          vm.roomData.recommend = param.recommend;
        },
        failMsg: "设置失败！"
      });
    },
    // 初始化下拉框数据
    initOptions() {
      this.$loading.open();
      return new Promise(resolve => {
        this.getDictOptionAction({ optionName: "bedType" })
          .then(
            bedTypeList => {
              this.options.bedType = bedTypeList;
              return this.getDictOptionAction({ optionName: "roomFacilities" });
            },
            err => {
              this.$message.warning("获取选项数据失败！");
            }
          )
          .then(roomFacilitiesList => {
            this.options.facilityList = roomFacilitiesList;
          })
          .finally(() => {
            this.$loading.close();
            resolve();
          });
      });
    },
    change() {
      this.$emit("change");
    },
    updateRoomTypeImg(imgList) {
      this.roomData.imgList = imgList;
    }
  },
  beforeMount() {
    this.initOptions();
  },
  mounted() {}
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
    border-radius: 50%;
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
      transition: all 300ms;
    }
    &:hover {
      .cover-text {
        transform: translateY(-30px);
        transition: all 300ms;
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
    .info-column {
      margin-top: 5px;
    }
  }
  > footer {
    padding: 10px 0;
    background-color: #f9f9f9;
  }
}
</style>
