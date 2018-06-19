import WidgetDate from "@/utils/widgetDate";

// 提交参数验证
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  let isCompletePrice = data.checkedItem.filter(v => {
    return !v.salePrice || isNaN(v.salePrice) || v.salePrice * 1 <= 0;
  });
  let pickedWeeks = data.week.filter(v => {
    return v.checked;
  });

  res.status = !(
    (!data.checkedItem.length && (res.msg = '请选择对应房型！')) ||
    ((!data.timeRange || !data.timeRange.length) && (res.msg = '请选择生效范围！')) |
    (!pickedWeeks.length && (res.msg = '请选择适用日期！')) ||
    (isCompletePrice.length && (res.msg = '卖价输入不合法！'))
  );
  return res;
};

// 格式化提交参数
const FormatSubmitData = (data) => {
  let dataModel = [];
  let from = WidgetDate._dateToStr(data.timeRange[0], 'yyyy-MM-dd', true);
  let to = WidgetDate._dateToStr(data.timeRange[1], 'yyyy-MM-dd', true);
  let pickedWeeks = data.week.filter(v => {
    return v.checked && v.id;
  });
  let weekList = [];
  pickedWeeks.forEach(v => {
    weekList.push(v.id);
  });
  data.checkedItem.forEach(roomType => {
    dataModel.push({
      roomTypeId: roomType.roomTypeId,
      roomTypeName: roomType.roomTypeName,
      ratePlanCode: roomType.ratePlanCode,
      accountId: roomType.accountId,
      // commissionPercent: roomType.commissionPercent,
      specialPrices: [
        {
          specialBeginDate: from,
          specialEndDate: to,
          otaRoomTypeId: roomType.otaRoomTypeId,
          otherSellingPrice: roomType.salePrice,
          weeks: weekList
        }
      ]
    });
  });
  let accountId = dataModel[0].accountId;
  return {
    accountId,
    jsonData: dataModel
  };
};



export default {
  CheckParamStatus,
  FormatSubmitData
};
