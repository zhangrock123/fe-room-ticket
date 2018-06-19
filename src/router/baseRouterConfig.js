const INDEX = r => require.ensure([], () => r(require('@/pages/index.vue')), 'index');
const ROOM_COUNT = r => require.ensure([], () => r(require('@/pages/roomCount.vue')), 'roomCount');
const ROOM_PRICE = r => require.ensure([], () => r(require('@/pages/roomPrice.vue')), 'roomPrice');
const ORDER = r => require.ensure([], () => r(require('@/pages/order.vue')), 'order');
const LOGIN = r => require.ensure([], () => r(require('@/pages/login.vue')), 'login');
const HOTEL_MANAGEMENT = r => require.ensure([], () => r(require('@/pages/hotelManagement.vue')), 'hotelMangement');
const ORDER_HISTORY = r => require.ensure([], () => r(require('@/pages/orderHistory.vue')), 'orderHistory');


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
    path: '/room-count/:innId/:accountId',
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
    path: '/room-price/:innId/:accountId',
    name: 'roomPrice',
    meta: {
      auth: true,
      title: '房价管理',
      template: 'appLayout',
      menuTag: 'hotel'
    },
    component: ROOM_PRICE
  },
  // 订单管理
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
  // 用户登录
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
  // 酒店管理（新增）
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
  },
  // 酒店管理（编辑）
  {
    path: '/hotel-management/:id/:component',
    name: 'editHotelManagement',
    meta: {
      auth: true,
      title: '酒店管理',
      template: 'appLayout',
      menuTag: 'hotel'
    },
    component: HOTEL_MANAGEMENT
  },
  // 下载中心
  {
    path: '/order-history',
    name: 'orderHistory',
    meta: {
      auth: true,
      title: '下载中心',
      template: 'appLayout',
      menuTag: 'order'
    },
    component: ORDER_HISTORY
  }
];
