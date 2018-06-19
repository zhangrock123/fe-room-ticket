// 用户信息或关于用户操作的接口
export default (axios, config) => {
  return {
    // 获取验证码图片和sessionid
    getVerifyImage(data = {}) {
      return axios.get(`${config.fqmsHost}/security/jcaptcha.jpg`, { params: data, withCredentials: true });
    },
    // 用户登录
    doUserLogin(data = {}) {
      return axios.post(`${config.fqmsHost}/user_login`, data, { withCredentials: true });
    },
    // 获取用户token信息（请求oms接口需要 token验证）-- ［3小时失效］
    getUserToken(data = {}) {
      /*
        data
          name   // 供应商id sysUserName
          code   // 登陆账号 sysUserCode
        以上两个字段从登录接口（doUserLogin）返回数据中获得 sysUserName 和 sysUserCode
      */
      return axios.get(`${config.pmsHost}/api/client/visitToken/${data.name}/${data.code}`, { params: {} });
    },
    // 用户登出
    doUserLoginout(data = {}) {
      return;
    }
  };
};
