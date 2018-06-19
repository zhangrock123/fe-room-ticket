// 提交参数验证
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  let isInvalidPrice = data.listPrices.some(v => {
    return !v.salePrice || isNaN(v.salePrice) || v.salePrice * 1 <= 0;
  });
  let isChecked = false;
  if (data.isUnionSetWeek) {
    isChecked = !!data.weekendList.filter(v => v.checked).length;
  }

  res.status = !(
    ((data.isAddWeekendPrice && !data.listPrices.length) && (res.msg = '请选择星期！')) ||
    ((!data.normalPrice.salePrice || isNaN(data.normalPrice.salePrice) || data.normalPrice.salePrice * 1 <= 0) && (res.msg = '输入平时卖价不合法！')) ||
    ((data.isAddWeekendPrice && isInvalidPrice) && (res.msg = '输入卖价不合法！')) ||
    ((data.isUnionSetWeek && !isChecked) && (res.msg = '请选择星期'))
  );
  return res;
};

// 格式化提交数据
const FormatSubmitData = (data, priceList) => {
  let dataModel = {
    accountId: data.roomTypeData.accountId,
    commissionPercent: data.roomTypeData.commissionPercent,
    defaultInitialPrice: data.roomTypeData.initialPrice,
    defaultPrice: data.normalPrice.salePrice,
    otaRoomTypeId: data.roomTypeData.otaRoomTypeId,
    ratePlanCode: data.roomTypeData.ratePlanCode,
    roomTypeId: data.roomTypeData.roomTypeId,
    roomTypeName: data.roomTypeData.roomTypeName,
    status: 1,
    weekPrices: []
  };
  let weekPricesModel = [];
  let basePriceModel = {
    accountId: dataModel.accountId,
    otaRoomTypeId: dataModel.otaRoomTypeId
  };
  if (data.isAddWeekendPrice) {
    if (data.isUnionSetWeek) {
      let curWeekInitialPrice = null;
      data.weekendList.forEach(v => {
        if (!v.checked){
          return;
        }
        curWeekInitialPrice = null;
        priceList.some(m => {
          if (m.weekDate * 1 == v.id) {
            curWeekInitialPrice = m.weekInitialPrice;
            return true;
          }
        });
        weekPricesModel.push({
          weekDate: v.id,
          weekSellingPrice: data.listPrices[0].salePrice,
          weekInitialPrice: curWeekInitialPrice,
          ...basePriceModel
        })
      });
    } else {
      data.listPrices.forEach(v => {
        weekPricesModel.push({
          weekDate: v.id,
          weekSellingPrice: v.salePrice,
          weekInitialPrice: v.weekInitialPrice,
          ...basePriceModel
        });
      });
    }
  }
  dataModel.weekPrices = weekPricesModel;
  return dataModel;
};


export default {
  CheckParamStatus,
  FormatSubmitData
};
