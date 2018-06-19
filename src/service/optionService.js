// 用于下拉框或其他选项类的接口
export default (axios, config) => {
  return {
    // 获取国内省市区联动数据
    getReginData(data = {}) {
      return axios.get(`${config.omsHost}/web/getOmsProvinceCityArea`, { params: data });
    },
    // 获取目的地信息
    getDesitionData(data = {}) {
      return axios.get(`${config.omsHost}/web/getPmsDestination`, { params: data });
    },
    // 获取配置数据（酒店设施数据等）
    getDictionaryData(data = {}) {
      return axios.get(`${config.omsHost}/web/getDictionaryList`, { params: data });
    },
    // 查询代销分销商列表接口
    getChannelList(data = {}) {
      return axios.get(`${config.fqmsHost}/roomticket/order/channelList`, { params: data, withCredentials: true });
    },
    // 查询子分销商列表接口
    getSubChannelList(data = {}) {
      return axios.get(`${config.fqmsHost}/roomticket/order/subChannelList`, { params: data, withCredentials: true });
    },
    // 获取第三方酒店的房型列表
    getThirdPartRoomTypeList(data = {}) {
      return axios.get(`${config.omsHost}/web/roomticket/roomtype/third/list`, { params: data });
    },
    // 获取价格计划列表数据
    getRatePlanList(data = {}) {
      return axios.get(`${config.omsHost}/channel/rateplan_relation/query`, { params: data });
    }
  };
};
