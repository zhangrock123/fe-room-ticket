<template>
<div class="app-flex app-flex-full app-flex-column">
  <div class="app-header">
    <nav class="app-flex app-flex-center app-flex-full">
      <div class="app-header-left text-center">
        <span class="box-center">后台管理系统</span>
      </div>
      <div class="col-1 paddingLR-10">
        <div class="app-flex app-flex-center">
          <div>
            <svg @click="isCollapse=!isCollapse" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" class="hamburger" :class="{'active': isCollapse}">
              <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"></path>
              <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"></path>
              <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"></path>
            </svg>
          </div>
          <div class="col-1 text-right">
            <screenfull class="marginR-10"></screenfull>
            <i class="icon-user user-avator"></i>
            <el-dropdown @command="dropdownCommand">
              <span class="el-dropdown-link">
                {{userInfo?userInfo.sysUserCode:''}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="editUserInfo">
                  <i class="el-icon-edit-outline"></i>
                  信息编辑
                </el-dropdown-item> -->
                <el-dropdown-item command="loginOut">
                  <i class="icon-power-off"></i>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

      </div>
    </nav>
  </div>
  <div class="col-1 flex-col-scroll">
    <div class="app-flex app-flex-full">
      <div class="app-menu">
        <el-menu
          :default-active="activeTag"
          @open="menuOpen"
          @close="menuClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="el-menu-box"
          :collapse="isCollapse">
          <el-menu-item
            v-for="(menu, $menuIndex) in menuList"
            :key="$menuIndex"
            :index="menu.activeTag"
            @click="pathTo(menu)">
            <i v-if="menu.icon" :class="menu.icon"></i>
            <span slot="title">{{menu.title}}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="col-1 app-box app-container">
          <slot></slot>
      </div>
    </div>
  </div>
</div>


</template>

<script>
import { Screenfull } from "@/components";
import { mapMutations, mapActions, mapGetters } from "vuex";
import utils from "@/utils";

export default {
  data() {
    return {
      activeTag: "",
      menuList: [],
      isCollapse: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {
    Screenfull
  },
  methods: {
    ...mapMutations(["CLEAR_USER_INFO"]),
    ...mapActions(["doUserLoginoutAction"]),
    menuOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    menuClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    // 配置左侧菜单
    initMenuList() {
      this.menuList = [
        {
          activeTag: "hotel",
          icon: "el-icon-menu",
          title: "酒店管理",
          pathName: "index"
        },
        {
          activeTag: "order",
          icon: "el-icon-tickets",
          title: "订单管理",
          pathName: "order"
        }
      ];
    },
    pathTo(menu) {
      this.$router.push({ name: menu.pathName, params: {}, query: {} });
    },
    // 初始化菜单激活状态
    initMenuActive() {
      let curMenuTag = this.$route.meta.menuTag;
      if (curMenuTag == this.activeTag) {
        return;
      }
      this.activeTag = curMenuTag;
    },
    // dropdown的选中方法
    dropdownCommand(command) {
      this[command] && this[command]();
    },
    // 退出系统
    loginOut() {
      this.$confirm("是否确认退出登录？", "退出登录").then(
        confirm => {
          this.doUserLoginoutAction().then(() => {
            this.$router.push({ name: "login" });
          });
        },
        cancel => {
          // console.log("err", err);
        }
      );
    }
  },
  watch: {
    $route(to) {
      this.initMenuActive();
    }
  },
  mounted() {
    this.initMenuList();
    this.initMenuActive();
  }
};
</script>

<style lang="less" scoped>
@menu_width: 180px;
.app-menu {
  background-color: #545c64;
  .el-menu-box:not(.el-menu--collapse) {
    width: @menu_width;
  }
}
.app-box,
.app-menu {
  overflow: hidden;
  overflow-y: auto;
}

.app-header {
  height: 50px;

  position: relative;
  nav {
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
      0 2px 1px -1px rgba(0, 0, 0, 0.12);
    background-color: #fff;
    z-index: 100;
    .app-header-left {
      position: relative;
      width: @menu_width;
      background-color: #409eff;
      color: #fff;
      align-self: stretch;
      * {
        width: 100%;
        font-size: 18px;
      }
    }
  }
  .user-avator {
    display: inline-block;
    border: 1px solid #ccc;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    line-height: 27px;
    font-size: 20px;
    color: #999;
    margin-right: 5px;
  }
}
.hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  transition: 0.38s;
  &.active {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    transition: 0.38s;
  }
}
</style>
