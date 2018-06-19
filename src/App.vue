<template>
  <div id="app">
    <transition v-if="!$route.meta.template" name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <transition v-if="$route.meta.template=='appLayout'" name="slide-fade" mode="out-in">
      <app-layout>
        <router-view></router-view>
      </app-layout>
    </transition>
  </div>
</template>

<script>
import { AppLayout } from "@/components";
import utils from "@/utils";
import { mapActions } from "vuex";
import service from "@/service";

export default {
  data() {
    return {};
  },
  components: {
    AppLayout
  },
  methods: {
    ...mapActions(["initStoreAction"]),
    /**
     * 全局ajax方法封装，页面通过 this.$root.commonCall() 调用相关api方法
     * @param {String} serviceName // 接口名
     * @param {Object} params // 接口请求参数
     * @param {Object} callback // 回调配置 {success(res) ,fail(res),failMsg,error(err)}； fail和failMsg二者取其一
     * @param {Boolean} isLoading // 是否显示loading
     */
    commonCall(serviceName, params, callback, isLoading = true) {
      return new Promise((resolve, reject) => {
        isLoading && this.$loading.open();
        service[serviceName](params)
          .then(
            res => {
              if (res.success) {
                callback && callback.success && callback.success(res);
                resolve();
              } else {
                if (callback && callback.fail) {
                  callback.fail(res);
                } else {
                  this.$message.warning(
                    res.data.message ||
                      (callback ? callback.failMsg : null) ||
                      "获取数据失败！"
                  );
                }
                reject();
              }
            },
            err => {
              if (callback && callback.error) {
                callback.error(err);
              } else {
                this.$message.error(
                  (callback ? callback.errorMsg : null) || "服务器错误！"
                );
              }
              reject();
            }
          )
          .finally(() => {
            isLoading && this.$loading.close();
          });
      });
    }
  },
  mounted() {
    this.initStoreAction();
    this.$root.commonCall = this.commonCall;
  }
};
</script>

<style lang="less" scoped>
</style>
