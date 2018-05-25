// 基础信息接口
export default (axios, config) => {
  return {
    // 获取酒店列表数据
    getInnList(data = {}) {
      // token userCode
      return axios.get(`${config.fqmsHost}/roomtickets/hotel/list`, { params: data });
    },
    // 获取酒店信息
    getInnDetail(data = {}) {
      // token innId userCode
      return axios.get(`${config.omsHost}/web/getInnInfo`, { params: data });
    }
  };
};
