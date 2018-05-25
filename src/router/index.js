import Vue from 'vue';
import Router from 'vue-router';

import baseRouterConfig from './baseRouterConfig';
import routerGuard from './routerGuard';

Vue.use(Router);

let vueRouter = new Router({
  // mode: 'history', // remove '#' of link
  routes: [...baseRouterConfig]
});


vueRouter.beforeEach((to, from, next) => {
  routerGuard(vueRouter, to, from, next);
});

vueRouter.afterEach((to, from, next) => {
});

export default vueRouter;
