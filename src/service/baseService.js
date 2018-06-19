// 基础信息接口
export default (axios, config) => {
  return {
    // 获取酒店列表数据
    getInnList(data = {}) {
      return axios.post(`${config.fqmsHost}/roomticket/hotel/list`, data, { withCredentials: true });
    },
    // 获取酒店信息
    getInnDetail(data = {}) {
      return axios.post(`${config.omsHost}/web/roomticket/hotel/detail`, data);
    },
    // 新增／编辑酒店信息
    createOrUpdateHotelInfo(data = {}) {
      data = { ...data, supplierId: config.getDefaultParam().param.supplierId };
      return axios.post(`${config.omsHost}/web/roomticket/hotel/add`, data, { requestType: 'payload' });
    },
    // 获取合作酒店列表信息
    getCooperationHotelList(data = {}) {
      return axios.get(`${config.omsHost}/web/roomticket/hotel/third/list`, { params: data });
    },
    // 获取合作酒店列表详情
    getCooperationHotelDetail(data = {}) {
      return axios.get(`${config.omsHost}/web/roomticket/hotel/third/detail`, { params: data });
    },
    // 开通代销
    openOta(data = {}) {
      // innId => fisId contractManagerId 正整数可不填
      data = { otaId: 102, authVendor: 'JSSD', ...data };
      return axios.post(`${config.omsHost}/account/openOta`, data);
    },
    // 查询订单列表
    getOrderList(data = {}) {
      return axios.get(`${config.fqmsHost}/roomticket/order/list`, { params: data, withCredentials: true });
    },
    // 导出订单接口
    exportOrder(data = {}) {
      return axios.get(`${config.fqmsHost}/roomticket/order/export`, { params: data, withCredentials: true });
    },
    // 查询下载文件列表
    getExportHistoryList(data = {}) {
      return axios.get(`${config.fqmsHost}/roomticket/order/fileList`, { params: data, withCredentials: true });
    },
    // 获取酒店房型列表
    getHotelRoomTypeList(data = {}) {
      return axios.post(`${config.omsHost}/web/roomticket/roomtype/list`, data);
    },
    // 新增／编辑酒店房型
    createOrUpdateHotelRoomType(data = {}) {
      return axios.post(`${config.omsHost}/web/roomticket/roomtype/add`, data, { requestType: 'payload' });
    },
    // 删除酒店房型
    removeHotelRoomType(data = {}) {
      return axios.get(`${config.omsHost}/web/roomticket/roomtype/delete`, { params: data });
    },
    // 设置酒店房型的推荐状态
    setRoomTypeRecommendStatus(data = {}) {
      return axios.get(`${config.omsHost}/web/roomticket/roomtype/recommend`, { params: data });
    },
    // 获取本地房型列表（包含上下架信息）
    getOnlineOfflineRoomTypeList(data = {}) {
      return axios.get(`${config.omsHost}/tomatoOmsOtaRoomtype/getRoomsByAccount`, { params: data });
    },
    // 房型上架
    onlineRoomType(data = {}) {
      let params = { innId: data.innId || '' };
      data.innId && (delete data.innId);
      return axios.post(`${config.omsHost}/price/create_update_price_record`, data, { params });
    },
    // 房态管理接口
    getRoomTypeInfo(data = {}) {
      return axios.get(`${config.omsHost}/tomatoOmsOtaRoomtype/getRoomtype`, { params: data });
    },
    // 修改房型房券数量
    editRoomTicketCount(data = {}) {
      return axios.post(`${config.omsHost}/web/ticket/settting`, data);
    },
    // 房型开关房
    setRoomTypeOpenStatus(data = {}) {
      let params = { innId: data.innId || '' };
      data.innId && (delete data.innId);
      return axios.post(`${config.omsHost}/close/room/open_or_close`, data, { params });
    },
    // 批量设置特殊价
    setRoomTypeSpecialPrice(data = {}) {
      let params = { innId: data.innId || '' };
      data.innId && (delete data.innId);
      return axios.post(`${config.omsHost}/channel/price/create_update_price_record`, data, { params });
    },
    // 设置默认价
    setRoomTypeDefaultPrice(data = {}) {
      let params = { innId: data.innId || '', accountId: data.accountId || '' };
      data.innId && (delete data.innId);
      data.accountId && (delete data.accountId);
      return axios.post(`${config.omsHost}/price/create_update_price_record`, data, { params });
    },
    getRoomTypePriceRecord(data = {}) {
      data = { ...data, otaId: 102 };
      return axios.get(`${config.omsHost}/price/getOtaRoomTypePriceInfo`, { params: data });
    }
  };
};
