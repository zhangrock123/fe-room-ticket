// 基础数据模型
const _BaseRoomTypeData = (roomTypeData) => {
  return {
    roomTypeId: roomTypeData.roomTypeId,
    roomTypeName: roomTypeData.roomTypeName,
    defaultPrice: roomTypeData.defaultPrice * 1 || '',
    initialPrice: 99999,
    ratePlanCode: roomTypeData.ratePlanCode || '',
    vendorRoomTypeId: roomTypeData.vendorRoomTypeId
  };
};

// 数据初始化模型
const FormatterDefaultRoomTypeData = (roomTypeData, hotelInfo) => {
  let dataModel = {
    ..._BaseRoomTypeData(roomTypeData),
    weekPrices: []
  };
  [1, 2, 3, 4, 5, 6, 7].forEach(v => {
    dataModel.weekPrices.push(_FormatterDefaultWeekData(v, roomTypeData, hotelInfo));
  });
  return dataModel;
};

// 数据初始化周末价模型
const _FormatterDefaultWeekData = (weekIndex, roomTypeData, hotelInfo) => {
  return {
    weekDate: weekIndex,
    weekSellingPrice: '',
    accountId: hotelInfo.accountId,
    otaRoomTypeId: roomTypeData.roomTypeId,
    weekInitialPrice: 99999
  };
};

// 上架房型数据模型
const FormatterSubmitRoomTypeData = (roomTypeData) => {
  let _roomTypeData = { ...roomTypeData };
  let dataModel = _BaseRoomTypeData(_roomTypeData);
  let weekPrices = [];
  _roomTypeData.weekPrices.forEach(v => {
    v.weekSellingPrice && weekPrices.push({
      ...v,
      weekSellingPrice: v.weekSellingPrice * 1
    });
  });
  dataModel.weekPrices = weekPrices;
  return dataModel;
};

// 格式化价格计划选项数据
const FormatterRatePlanData = (rateplanList) => {
  // payType 0  breakfastType 0  预付 - 无早餐
  let res = [];
  if (rateplanList && rateplanList.length) {
    rateplanList.forEach(v => {
      res.push({
        id: v.id,
        name: `${!v.payType ? '预付' : '现付'}-${!v.breakfastType ? '无早餐' : '有早餐'}`
      });
    });
  }
  return res;
};

// 提交参数验证
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  let validWeekPriceRes = { status: true, msg: '' };
  data.weekPrices.some(v => {
    if (v.weekSellingPrice && v.weekSellingPrice.replace(/\s+/g, '')) {
      if (isNaN(v.weekSellingPrice)) {
        return validWeekPriceRes = { status: false, msg: '周末价输入不合法！' };
      }
      if (v.weekSellingPrice * 1 <= 0) {
        return validWeekPriceRes = { status: false, msg: '周末价必须大于0！' };
      }
    }
  });
  res.status = !(
    (!data.vendorRoomTypeId && (res.msg = '请选择绑定房型！')) ||
    (!data.ratePlanCode && (res.msg = '请选择价格计划！')) ||
    (!data.defaultPrice && (res.msg = '请输入卖价！')) ||
    (!validWeekPriceRes.status && (res.msg = validWeekPriceRes.msg))
  );
  return res;
};

// 获取弹出框表格配置数据
const FormatterOptionDialogColumn = () => {
  return [
    {
      title: '房型ID',
      width: '30%',
      column: 'roomTypeId'
    },
    {
      title: '房型名称',
      column: 'roomTypeName'
    }
  ];
};


export default {
  FormatterOptionDialogColumn,
  FormatterDefaultRoomTypeData,
  FormatterSubmitRoomTypeData,
  FormatterRatePlanData,
  CheckParamStatus
};
