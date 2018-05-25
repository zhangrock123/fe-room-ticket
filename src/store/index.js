import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

let state = {
  userInfo: null
};

let storeState = store => {
  store.subscribe((mutation) => {
    switch (mutation.type) {
      default:
        break;
    }
  });
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [storeState]
});
