/**
   * [设置某个cookie的值]
   * @param  {String}   name
   * @param  {String/Object}  value
   * @param {String}    path
   * @param  {String}   days
  */
const setCookie = (name, value, path, days) => {
  if (!name) return;
  let Days = days || 90, exp = new Date(), Path = path ? path : '/';
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  'object' == typeof (value) && (value = JSON.stringify(value));
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=${Path}`;
};

/**
 * [获得某个cookie的值]
 * @param {String}   name
*/
const getCookie = (name) => {
  const cookieReg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  let arr;
  if (arr = document.cookie.match(cookieReg)) {
    let resStr = unescape(arr[2]);
    if (/(^\{.+\}$)|(^\[.+\]$)/.test(resStr)) {
      return JSON.parse(resStr);
    }
    return resStr;
  }
  return null;
};

/**
 * 存储localstorage
 * @param {String} key
 * @param {Any} value
 */
const setStore = (key, value) => {
  if (typeof (value) == 'object') {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
};

/**
 * 获取localstorage
 * @param {String} key
 */
const getStore = (key) => {
  let objReg = /(^\{.{1,}\}$)|((^\[.{1,}\]$))/;
  let storeRes = localStorage.getItem(key);
  if (!storeRes) {
    return storeRes;
  }
  if (objReg.test(storeRes)) {
    storeRes = JSON.parse(storeRes);
  }
  return storeRes;
};

/**
 * 移除某个localstorage
 * @param {String} key
 */
const removeStore = (key) => {
  localStorage.removeItem(key);
};

export default {
  setCookie,
  getCookie,
  setStore,
  getStore,
  removeStore
};
