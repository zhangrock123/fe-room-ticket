import WidgetDate from "@/utils/widgetDate";

// 提交参数验证
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  res.status = !(
    (!data.checkedItem.length && (res.msg = '请选择对应房型！')) ||
    ((!data.timeRange || !data.timeRange.length) && (res.msg = '请选择生效范围！'))
  );
  return res;
};

// 格式化提交数据
const FormatSubmitData = (data) => {
  let closeDatesModel = [];
  let diffDays = WidgetDate._diff(data.timeRange[0], data.timeRange[1], 'd');
  for (let i = 0; i <= diffDays; i++) {
    closeDatesModel.push({
      closeDate: WidgetDate._dateToStr(new Date(data.timeRange[0] * 1 + 24 * 60 * 60 * 1000 * i), 'yyyy-MM-dd', true)
    });
  }
  let dataModel = null;
  data.checkedItem.forEach(roomType => {
    if (!dataModel) {
      dataModel = {
        accountId: roomType.accountId,
        otaId: roomType.otaId,
        innId: roomType.innId,
        type: !data.status ? 'CLOSE' : 'OPEN',
        closeRoomTypes: []
      };
    }
    dataModel.closeRoomTypes.push({
      closeDates: closeDatesModel,
      otaRoomTypeId: roomType.otaRoomTypeId
    });
  });
  return {
    innId: dataModel.innId,
    closeRoomParam: JSON.stringify(dataModel)
  };
};


export default {
  CheckParamStatus,
  FormatSubmitData
};
