import axios from 'axios';
import qs from 'qs';
import config from '@/config';
import store from '@/store';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = config.apiHost;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.withCredentials = true;

// POST传参序列化
axios.interceptors.request.use(config => {
  let defaultParam = {};
  if (store.getters.userInfo && store.getters.userInfo.JSESSIONID) {
    defaultParam = {
      JSESSIONID: store.getters.userInfo.JSESSIONID,
      token: store.getters.userInfo.userToken,
      userCode: store.getters.userInfo.sysUserCode
    };
  }
  if (config.method === 'post') {
    config.data = { ...(config.data || {}), ...defaultParam };
    config.data = qs.stringify(config.data);
  } else {
    config.params = { ...(config.params || {}), ...defaultParam };
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 返回状态判断
axios.interceptors.response.use(res => {
  if (!res.data || typeof (res.data) == 'string') {
    res.data = {
      status: 'failed'
    };
  }
  return res;
}, error => {
  return Promise.reject(error);
});


import baseService from './baseService';
import optionService from './optionService';
import authService from './authService';

export default {
  ...baseService(axios, config),
  ...optionService(axios, config),
  ...authService(axios, config)
}
