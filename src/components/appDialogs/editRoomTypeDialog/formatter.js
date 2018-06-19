// 基本数据模型
const _BaseDataModel = (data, roomTypeId) => {
  return {
    innId: data.innId || '',
    bedLen: data.bedLen || '',
    bedNum: data.bedNum || '',
    bedType: data.bedType || '',
    bedWid: data.bedWid || '',
    floorNum: data.floorNum || '',
    roomTypeId: data.roomTypeId || roomTypeId || '',
    imgList: [...data.imgList],
    recommend: data.recommend || 0,
    roomArea: data.roomArea || '',
    roomInfo: data.roomInfo || '',
    roomTypeName: data.roomTypeName || ''
  };
};

// 格式化提交数据
const FormatterSubmitData = (data, roomTypeId) => {
  let dataModel = _BaseDataModel(data, roomTypeId);
  dataModel.facilities = data.facilities.join(',');
  return dataModel;
};

// 格式化初始数据
const FormatterDefaultData = (data) => {
  let _data = { ...data };
  let dataModel = _BaseDataModel(_data);
  dataModel.facilities = [];
  _data.facilities && _data.facilities.split(',').forEach(v => {
    dataModel.facilities.push(v * 1);
  });
  return dataModel;
};

// 检查提交参数合法性
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  res.status = !(
    (!data.roomTypeName && (res.msg = '房型名称不能为空！')) ||
    (!data.bedType && (res.msg = '请选择床型！')) ||
    (!data.bedWid && (res.msg = '请输入床宽！')) ||
    (!data.facilities && (res.msg = '请选择设施！')) ||
    (!data.roomInfo && (res.msg = '请输入房型简介！'))
  );
  return res;
};

export default {
  FormatterSubmitData,
  FormatterDefaultData,
  CheckParamStatus
};
