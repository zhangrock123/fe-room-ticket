const INDEX = r => require.ensure([], () => r(require('@/pages/index.vue')), 'index');
const ROOM_COUNT = r => require.ensure([], () => r(require('@/pages/roomCount.vue')), 'index');
const ROOM_PRICE = r => require.ensure([], () => r(require('@/pages/roomPrice.vue')), 'index');
const ORDER = r => require.ensure([], () => r(require('@/pages/order.vue')), 'order');
const LOGIN = r => require.ensure([], () => r(require('@/pages/login.vue')), 'login');
const HOTEL_MANAGEMENT = r => require.ensure([], () => r(require('@/pages/hotelManagement.vue')), 'hotelMangement');


/**
 * 路由meta参数配置说明
 *  auth  是否需要用户登录验证
 *  title 改变浏览器标题名称
 *  template 使用模版名称
 *  menuTag 左侧栏菜单项激活
 */

export default [
  // 缺省页面重定向主页面
  {
    path: '/',
    redirect: { name: 'index' }
  },
  // 主页面
  {
    path: '/index',
    name: 'index',
    meta: {
      auth: true,
      title: '首页',
      template: 'appLayout',
      menuTag: 'hotel'
    },
    component: INDEX
  },
  // 房量管理
  {
    path: '/room-count',
    name: 'roomCount',
    meta: {
      auth: true,
      title: '房量管理',
      template: 'appLayout',
      menuTag: 'hotel'
    },
    component: ROOM_COUNT
  },
  // 房价管理
  {
    path: '/room-price',
    name: 'roomPrice',
    meta: {
      auth: true,
      title: '房价管理',
      template: 'appLayout',
      menuTag: 'hotel'
    },
    component: ROOM_PRICE
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      auth: true,
      title: '订单管理',
      template: 'appLayout',
      menuTag: 'order'
    },
    component: ORDER
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      auth: false,
      title: '用户登录',
      template: '',
      menuTag: ''
    },
    component: LOGIN
  },
  {
    path: '/hotel-management',
    redirect: { name: 'hotelManagement', params: {component: 'hotel-info'} }
  },
  {
    path: '/hotel-management/:component',
    name: 'hotelManagement',
    meta: {
      auth: true,
      title: '酒店管理',
      template: 'appLayout',
      menuTag: 'hotel'
    },
    component: HOTEL_MANAGEMENT
  }
];
