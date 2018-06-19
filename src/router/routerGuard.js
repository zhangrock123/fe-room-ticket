import utils from '@/utils';
import store from "@/store";

// 获取用户登录状态和token状态
let getAuthStatus = () => {
  let authRes = {
    isLogin: true,      // 是否已登陆
    isValidCode: true   // 是否需要拿取code
  };
  // 没有userName+userCode，重新登录
  let userName = utils.getCookie("userName");
  let userCode = utils.getCookie('userCode');
  if (!userName || !userCode) {
    authRes.isLogin = false;
    return authRes;
  }
  // 没有用户信息，重新登录
  let userInfo = utils.getStore("userInfo");
  if (!userInfo || !userInfo.sysUserName || !userInfo.sysUserCode) {
    authRes.isLogin = false;
    return authRes;
  }
  // 没有用户token，重新获取token
  let userToken = utils.getStore('userToken');
  if (!userToken) {
    authRes.isValidCode = false;
    return authRes;
  }
  // 如果token过期，重新获取token
  let tokenExpire = utils.getStore('tokenExpire');
  let curUnixTime = new Date().getTime();
  if (tokenExpire - curUnixTime <= 0) {
    authRes.isValidCode = false;
    return authRes;
  }
  return authRes;
};

export default (vueRouter, to, from, next) => {
  document.getElementsByTagName('title')[0].innerHTML = to && to.meta && to.meta.title ? to.meta.title : '系统';

  if (to.meta.auth) {
    // return next(); // 调试之用
    let authStatus = getAuthStatus();
    // console.log(authStatus)
    // 是否需要登录
    if (!authStatus.isLogin) {
      return store.dispatch('doUserLoginoutAction').then(() => {
        vueRouter.push({
          name: 'login',
          query: {
            redirect: to.name,
            params: JSON.stringify(to.params),
            query: JSON.stringify(to.query)
          }
        });
      });
    }
    // 是否需要获取用户token信息
    if (!authStatus.isValidCode) {
      return store.dispatch('getUserTokenAction').then(() => {
        next();
      }, msg => {
        alert(msg || '获取用户信息失败,请刷新或重新登录！');
      });
    }
    next();
  } else {
    next();
  }
};
