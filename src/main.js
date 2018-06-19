import Vue from 'vue';
import App from './App';
import router from './router';
import * as filters from './filters';
import store from './store';
import VueDND from 'awe-dnd';
import ELEMENT from 'element-ui';
import './assets/styles/index.less';

Vue.use(VueDND);
Vue.use(ELEMENT);
Vue.config.productionTip = false;

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

// 扩展自定义方法
Vue.prototype.$loading = {
  loading: null,
  normal(settings) {
    this.loading = ELEMENT.Loading.service(settings);
  },
  open(txt) {
    this.loading = ELEMENT.Loading.service({
      text: txt || '加载中...'
    });
  },
  close() {
    this.loading && this.loading.close();
    this.loading = null;
  }
};
Vue.prototype.$message = {
  _base(tip, type) {
    return ELEMENT.Message({
      message: tip,
      type: type || ''
    });
  },
  normal(tip) {
    return this._base(tip);
  },
  success(tip) {
    return this._base(tip, 'success');
  },
  warning(tip) {
    return this._base(tip, 'warning');
  },
  error(tip) {
    return this._base(tip, 'error');
  }
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  data: {
    commonCall:null
  },
  methods: {}
});
