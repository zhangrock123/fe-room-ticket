import utils from '@/utils';
import service from '@/service';

let baseGetOptionAjaxPromise = (serviceName, optionName, isForce, expr) => {
  return new Promise((resolve, reject) => {
    let cacheOption = utils.getStore(optionName);
    if (!isForce && cacheOption) {
      return resolve(cacheOption);
    }
    service[serviceName]().then(res => {
      if (res.success) {
        if (expr) {
          expr(res.data, resolve, reject);
        } else {
          utils.setStore(optionName, res.data.result);
          resolve(res.data.result);
        }
      } else {
        reject();
      }
    }, err => {
      reject(err);
    });
  });
}

export default {
  // 设置用户信息数据
  setUserInfoAction({ commit }, userInfo) {
    if (userInfo) {
      utils.setCookie('userCode', userInfo.sysUserCode, 'HTTPOnly', 1000);
      utils.setCookie('userName', userInfo.sysUserName, 'HTTPOnly', 1000);
      utils.setStore('userInfo', userInfo);
      commit('UPDATE_USER_INFO', userInfo);
    }
  },
  // 用于页面刷新时候的vuex状态的丢失，这里做重新赋值
  initStoreAction({ commit }) {
    let userInfo = utils.getStore('userInfo');
    let userToken = utils.getStore('userToken');
    userInfo && commit('UPDATE_USER_INFO', userInfo);
    userToken && commit('UPDATE_USER_INFO', { userToken });
  },
  // 用户登出
  doUserLoginoutAction({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_USER_INFO');
      utils.setCookie('userCode', '', null, '-1');
      utils.setCookie('userName', '', null, '-1');
      utils.removeStore('userInfo');
      utils.removeStore('userToken');
      utils.removeStore('tokenExpire');
      resolve();
    });
  },
  // 获取用户toke
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
            utils.setStore('userToken', res.data.token);
            utils.setStore('tokenExpire', (diff + now));
            commit('UPDATE_USER_INFO', { userToken: res.data.token });
          }
        })
        .finally(resolve);
    });
  },
  // 获取省市区数据
  getGeoOptionAction({ }, isForce) {
    return baseGetOptionAjaxPromise('getReginData', 'provinceList', isForce, null);
  },
  // 获取字典数据
  getDictOptionAction({ }, settings) {
    return baseGetOptionAjaxPromise('getDictionaryData', settings.optionName, settings.isForce, (data, resolve, reject) => {
      data.list &&
        data.list.forEach(v => {
          utils.setStore(v.conType, v.dic);
        });
      resolve(utils.getStore(settings.optionName));
    });
  },
  // 获取目的地数据
  getDestinationOptionAction({ }, isForce) {
    return baseGetOptionAjaxPromise('getDesitionData', 'destinationList', isForce, null);
  }
};
