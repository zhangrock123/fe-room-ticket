const AppLayout = () => import("./appLayout/index.vue");
const DragTable = () => import("./dragTable/index.vue");
const DateInlinePicker = () => import("./dateInlinePicker/index.vue");
const OpenCloseRoomDialog = () => import("./openCloseRoomDialog/index.vue");
const EditRoomCountDialog = () => import("./editRoomCountDialog/index.vue");
const EditDefaultPriceDialog = () => import("./editDefaultPriceDialog/index.vue");
const EditSpecialPriceDialog = () => import("./editSpecialPriceDialog/index.vue");
const RoomTypeCard = () => import("./roomTypeCard/index.vue");
const EditRoomTypeDialog = () => import('./editRoomTypeDialog/index.vue');
const LimitInput = () => import('./limitInput/index.vue');
const ImageUploadDialog = () => import('./imageUploadDialog/index.vue');
const Screenfull = () => import('./screenfull/index.vue');
const OnlineRoomTypeDialog = () => import('./onlineRoomTypeDialog/index.vue');
const CheckItem = () => import('./checkItem/index.vue');
const CheckWeekItem = () => import('./checkWeekItem/index.vue');
const SelectOptionDialog = () => import('./selectOptionDialog/index.vue');
const BaiduMap = () => import('./baiduMap/index.vue');


module.exports = {
  AppLayout,
  DragTable,
  DateInlinePicker,
  OpenCloseRoomDialog,
  EditRoomCountDialog,
  EditDefaultPriceDialog,
  EditSpecialPriceDialog,
  RoomTypeCard,
  EditRoomTypeDialog,
  LimitInput,
  ImageUploadDialog,
  Screenfull,
  OnlineRoomTypeDialog,
  CheckItem,
  CheckWeekItem,
  SelectOptionDialog,
  BaiduMap
};
