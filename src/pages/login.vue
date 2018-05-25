<template>
<div class="login-container">
  <div class="login-box box-center">
    <header class="text-center font-16">
      用户登录
    </header>
    <section>
      <ul class="input-section-box">
        <li>
          <el-input placeholder="请输入登录账号" v-model="loginInfo.j_username">
            <template slot="prepend">
              <div class="width-20 text-center">
                <i class="icon-user font-18"></i>
              </div>
            </template>
          </el-input>
        </li>
        <li>
          <el-input type="password" placeholder="请输入登录密码" v-model="loginInfo.j_password">
            <template slot="prepend">
              <div class="width-20 text-center">
                <i class="icon-lock font-18"></i>
              </div>
            </template>
          </el-input>
        </li>
        <li>
          <el-input class="verify-image" placeholder="请输入验证码" v-model="loginInfo.j_captcha">
            <template slot="append">
              <img @click="getVerifyImg" :src="`data:image/jpeg;base64,${verifyImg}`" alt="">
            </template>
          </el-input>
        </li>
      </ul>
    </section>
    <footer class="text-center">
      <el-button @click="doLogin" size="small" type="success">
        <div class="width-100 font-14">登 录</div>
      </el-button>
    </footer>
  </div>
</div>
</template>

<script>
import service from "@/service";
import { mapActions } from "vuex";
import utils from "@/utils";
export default {
  data() {
    return {
      redirectInfo: {
        name: this.$route.query.redirect || "index",
        query: this.$route.query.query || "{}",
        params: this.$route.query.params || "{}"
      },
      loginInfo: {
        j_username: "admin",
        j_password: "111111",
        j_captcha: ""
      },
      verifyImg: ""
    };
  },
  methods: {
    ...mapActions(["setJSSESSIONIDAction", "setUserInfoAction"]),
    // 参数信息验证
    paramCheck() {
      let res = { status: false, msg: "" };
      res.status = !(
        (!this.loginInfo.j_username && (res.msg = "账号信息为空！")) ||
        (!this.loginInfo.j_password && (res.msg = "密码为空！")) ||
        (!this.loginInfo.j_captcha && (res.msg = "验证码为空！"))
      );
      return res;
    },
    // 登录操作
    doLogin() {
      let paramCheck = this.paramCheck();
      if (!paramCheck.status) {
        return this.$message.warning(paramCheck.msg);
      }
      service.doUserLogin({ ...this.loginInfo }).then(res => {
        if (res.data && res.data.status == "success") {
          this.setUserInfoAction(res.data.data);
          this.$router.replace({
            name: this.redirectInfo.name,
            query: JSON.parse(this.redirectInfo.query),
            params: JSON.parse(this.redirectInfo.params)
          });
        } else {
          this.getVerifyImg();
          this.loginInfo.j_captcha = "";
          this.$message.warning(res.data.message || "账号或密码错误！");
        }
      });
    },
    // 获取JSESSIONID和验证码图片
    getVerifyImg() {
      this.$loading.open();
      service
        .getVerifyImage()
        .then(
          res => {
            if (res.data && res.data.captchaImg && res.data.sessionId) {
              this.verifyImg = res.data.captchaImg;
              this.setJSSESSIONIDAction(res.data.sessionId);
            } else {
              this.$message.warning("数据获取异常！");
            }
          },
          err => {
            this.$message.warning("服务器错误！");
          }
        )
        .finally(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getVerifyImg();
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #f2f2f2;
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("~@/assets/images/login-bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  .login-box {
    width: 320px;
    height: auto;
    padding: 30px 25px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid #eee;
    border-radius: 6px;
    > header {
      margin-bottom: 25px;
    }
    .input-section-box {
      li {
        + li {
          margin-top: 15px;
        }
      }
    }
    > footer {
      margin-top: 25px;
    }
  }
}
</style>
