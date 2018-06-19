// 图片类接口（酒店／房型图片）
export default (axios, config) => {
  return {
    // 获取上传图片地址
    getUploadImgUrl(data = {}) {
      return `${config.omsHost}/web/roomticket/img/upload?${config.getDefaultParam().paramStr}`;
    },
    // 剪切图片
    cutHotelOrRoomTypeImg(data = {}) {
      return axios.post(`${config.omsHost}/web/roomticket/img/cut`, data, { requestType: 'payload' });
    },
    // 删除图片
    deleteHotelOrRoomTypeImg(data = {}) {
      return axios.post(`${config.omsHost}/web/roomticket/img/delete`, data, { requestType: 'payload' });
    },
    // 调整酒店图片和房型图片顺序
    setImageSequence(data={}){
      return axios.post(`${config.omsHost}/web/roomticket/img/seq`, data, { requestType: 'payload' });
    }
  };
};
