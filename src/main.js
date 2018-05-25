// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import * as filters from './filters';
import store from './store';
import ComponentsInstallation from './components-installation';
import VueDND from 'awe-dnd';

Vue.use(VueDND);
ComponentsInstallation();
import './assets/styles/index.less';

Vue.config.productionTip = false;

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  data: {},
  methods: {}
});
