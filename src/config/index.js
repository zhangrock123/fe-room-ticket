const CONFIG = {
  // 测试环境
  development: {
    fqmsHost: '',
    pmsHost: '',
    omsHost: ''
  },
  // 模拟环境
  staging: {
    fqmsHost: '',
    pmsHost: '',
    omsHost: ''
  },
  // 正式环境
  production: {
    fqmsHost: '',
    pmsHost: '',
    omsHost: ''
  }
};

module.exports = CONFIG[process.env.NODE_ENV];
