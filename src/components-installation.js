import Vue from 'vue';
import {
  Icon,
  Input,
  Button,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Tag,
  DatePicker,
  Dialog,
  Checkbox,
  CheckboxGroup,
  Radio,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Loading,
  MessageBox,
  Message,
  Tabs,
  TabPane,
  Row,
  Col,
  Popover,
  Upload,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Breadcrumb,
  BreadcrumbItem,
  Alert
} from 'element-ui';

export default () => {
  Vue.use(Icon);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Select);
  Vue.use(Option);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Pagination);
  Vue.use(Tag);
  Vue.use(DatePicker);
  Vue.use(Dialog);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Radio);
  Vue.use(Menu);
  Vue.use(Submenu);
  Vue.use(MenuItem);
  Vue.use(MenuItemGroup);
  Vue.use(Tabs);
  Vue.use(TabPane);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Popover);
  Vue.use(Upload);
  Vue.use(Dropdown);
  Vue.use(DropdownMenu);
  Vue.use(DropdownItem);
  Vue.use(Breadcrumb);
  Vue.use(BreadcrumbItem);
  Vue.use(Alert);


  Vue.use(Loading.directive);

  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$loading = {
    loading: null,
    normal(settings) {
      this.loading = Loading.service(settings);
    },
    open(txt) {
      this.loading = Loading.service({
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
      return Message({
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
};
