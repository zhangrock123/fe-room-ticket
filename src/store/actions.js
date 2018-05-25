import utils from '@/utils';
import service from '@/service';

export default {
  // 设置JSSESSIONID数据
  setJSSESSIONIDAction({ commit }, JSESSIONID) {
    if (!JSESSIONID) {
      return;
    }
    utils.setCookie('JSESSIONID', JSESSIONID, "HTTPOnly", 15);
    commit('UPDATE_USER_INFO', { JSESSIONID });
  },
  // 设置用户信息数据
  setUserInfoAction({ commit }, userInfo) {
    if (!userInfo) {
      return;
    }
    utils.setStore('userInfo', userInfo);
    commit('UPDATE_USER_INFO', userInfo);
  },
  // 用于页面刷新时候的vuex状态的丢失，这里做重新赋值
  initStoreAction({ commit }) {
    let JSESSIONID = utils.getCookie('JSESSIONID');
    let userInfo = utils.getStore('userInfo');
    let userToken = utils.getStore('userToken');
    JSESSIONID && commit('UPDATE_USER_INFO', { JSESSIONID });
    userInfo && commit('UPDATE_USER_INFO', userInfo);
    userToken && commit('UPDATE_USER_INFO', { userToken });
  },
  // 用户登出
  doUserLoginoutAction({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_USER_INFO');
      utils.setCookie('JSESSIONID', '', null, '-1');
      utils.removeStore('userInfo');
      utils.removeStore('userToken');
      utils.removeStore('tokenExpire');
      resolve();
    });
  },
  // 获取用户token
  getUserTokenAction({ commit }) {
    const USER_INFO = utils.getStore('userInfo');
    return new Promise((resolve, reject) => {
      if (!USER_INFO) {
        return reject();
      }
      service
        .getUserToken({
          name: USER_INFO.sysUserName,
          code: USER_INFO.sysUserCode
        })
        .then(res => {
          if (res.data) {
            let now = new Date().getTime();
            let diff = 3 * 60 * 60 * 1000; // 三小时过期
            utils.setStore('userToken', res.data.data.token);
            utils.setStore('tokenExpire', (diff + now));
            commit('UPDATE_USER_INFO', { userToken: res.data.data.token });
          }
        })
        .finally(resolve);
    });
  }
};
