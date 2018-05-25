const CONFIG = {
  development: {
    fqmsHost: '',
    pmsHost: '',
    omsHost: ''
  },
  production: {
    fqmsHost: '',
    pmsHost: '',
    omsHost: ''
  }
};

module.exports = CONFIG[process.env.NODE_ENV];
