// common components
const AppLayout = () => import("./appLayout/index.vue");
const DragTable = () => import("./dragTable/index.vue");
const DateInlinePicker = () => import("./dateInlinePicker/index.vue");
const RoomTypeCard = () => import("./roomTypeCard/index.vue");
const LimitInput = () => import('./limitInput/index.vue');
const Screenfull = () => import('./screenfull/index.vue');
const CheckItem = () => import('./checkItem/index.vue');
const CheckWeekItem = () => import('./checkWeekItem/index.vue');
const BaiduMap = () => import('./baiduMap/index.vue');
const GeoOption = () => import('./geoOption/index.vue');

// appDialogs
const EditRoomTypeDialog = () => import('./appDialogs/editRoomTypeDialog/index.vue');
const ImageUploadDialog = () => import('./appDialogs/imageUploadDialog/index.vue');
const OnlineRoomTypeDialog = () => import('./appDialogs/onlineRoomTypeDialog/index.vue');
const OpenCloseRoomDialog = () => import("./appDialogs/openCloseRoomDialog/index.vue");
const EditRoomCountDialog = () => import("./appDialogs/editRoomCountDialog/index.vue");
const EditDefaultPriceDialog = () => import("./appDialogs/editDefaultPriceDialog/index.vue");
const EditSpecialPriceDialog = () => import("./appDialogs/editSpecialPriceDialog/index.vue");
const SelectOptionDialog = () => import('./appDialogs/selectOptionDialog/index.vue');
const OrderDetailDialog = () => import('./appDialogs/orderDetailDialog/index.vue');
const ImageCropperDialog = () => import('./appDialogs/imageCropperDialog/index.vue');



module.exports = {
  AppLayout,
  DragTable,
  DateInlinePicker,
  RoomTypeCard,
  LimitInput,
  Screenfull,
  CheckItem,
  CheckWeekItem,
  BaiduMap,
  GeoOption,
  EditRoomTypeDialog,
  ImageUploadDialog,
  OnlineRoomTypeDialog,
  OpenCloseRoomDialog,
  EditRoomCountDialog,
  EditDefaultPriceDialog,
  EditSpecialPriceDialog,
  SelectOptionDialog,
  OrderDetailDialog,
  ImageCropperDialog
};
