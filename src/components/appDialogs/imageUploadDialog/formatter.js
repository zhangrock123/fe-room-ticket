// 格式化图片数据
const FormatImgData = (dataList, innId, roomTypeId) => {
  let dataModel = [];
  if (dataList && dataList.length) {
    dataList.forEach((v, i) => {
      dataModel.push({
        ...v,
        seq: i + 1,
        innId,
        roomTypeId
      });
    });
  };
  return dataModel;
};

export default {
  FormatImgData
}
