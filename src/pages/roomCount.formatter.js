import WidgetDate from "@/utils/widgetDate";

const FormatRoomTypeData = (data) => {
  let dataModel = [];
  let dateModel = [];
  let curRoomModel = {};
  data.forEach(roomType => {
    curRoomModel = _RoomTypeModel(roomType);
    roomType.roomDetail.forEach((room, roomIdx) => {
      dateModel[roomIdx] = _DateModel(room, dateModel[roomIdx]);
      curRoomModel.roomDetail.push(_RoomModel(roomType, room, dateModel[roomIdx]));
    });
    dataModel.push(curRoomModel);
    curRoomModel = {};
  });
  return {
    data: dataModel,
    date: dateModel
  };
};

const _RoomTypeModel = (roomType) => {
  return {
    accountId: roomType.accountId,
    innId: roomType.innId,
    roomTypeId: roomType.roomTypeId,
    roomTypeName: roomType.roomTypeName,
    otaRoomTypeId: roomType.otaRoomTypeId,
    sellingPrice: roomType.sellingPrice,
    initialPrice: roomType.initialPrice,
    weekDate: roomType.weekDate,
    weekDateArr: (roomType.weekDate || '').split(','),
    ticketNumber: roomType.ticketNumber || 0,
    roomDetail: [],
    ratePlanCode: roomType.ratePlanCode,
    otaId: 102,
    commissionPercent: roomType.commissionPercent || 15
  };
};

const _DateModel = (room, originDate = {}) => {
  let date = WidgetDate._plainDate(room.roomDate.replace(/\-/g, ''));
  let originStatus = originDate.date ? originDate.status : true;
  return {
    date,
    dateName: WidgetDate._dateToStr(date, 'MM月dd日', false),
    workDayName: WidgetDate._workDayName(date),
    roomNum: (originDate.roomNum || 0) + room.roomNum,
    otaRoomNum: (originDate.otaRoomNum || 0) + room.otaRoomNum,
    status: originStatus && (room.status.toLowerCase() == 'open')
  };
};


const _RoomModel = (roomType, room, dateInfo) => {
  let statusInfo = _GetRoomStatusInfo(room.status);
  return {
    accountId: roomType.accountId,
    innId: roomType.innId,
    roomTypeId: roomType.roomTypeId,
    ratePlanCode: roomType.ratePlanCode,
    sellingPrice: roomType.sellingPrice,
    commissionPercent: roomType.commissionPercent || 15,
    otaRoomTypeId: room.otaRoomTypeId,
    roomTypeName: room.roomTypeName,
    roomDate: room.roomDate,
    roomPrice: room.roomPrice,
    roomNum: room.roomNum,
    otaRoomNum: room.otaRoomNum,
    priceStatus: room.priceStatus,
    status: room.status,
    statusSwitcher: statusInfo.status,
    statusLabel: statusInfo.name,
    statusValue: statusInfo.val,
    day: dateInfo.date.getDay(),
    workDayName: dateInfo.workDayName,
    otaId: 102
  };
};

const _GetRoomStatusInfo = (status) => {
  const STATUS_DICT = {
    //开房
    OPEN: { val: 0, name: '', status: true },
    //关房
    CLOSE: { val: 1, name: '停售', status: false },
    //不可售
    NO_SALE: { val: 2, name: '满房', status: true },
    //节日关房
    FESTIVAL_CLOSE: { val: 3, name: '停售', status: false }
  };
  return STATUS_DICT[status];
};

const FormatSingleRoomOpenCloseData = (data) => {
  let closeRoomParam = {
    accountId: data.accountId,
    otaId: data.otaId,
    innId: data.innId,
    type: data.statusSwitcher ? 'CLOSE' : 'OPEN',
    closeRoomTypes: [
      {
        closeDates: [{ closeDate: data.roomDate }],
        otaRoomTypeId: data.otaRoomTypeId
      }
    ]
  };
  return {
    innId: data.innId,
    closeRoomParam: JSON.stringify(closeRoomParam)
  };
};


const FormatSpecialPriceData = (data) => {
  let dataModel = [{
    roomTypeId: data.roomTypeId,
    roomTypeName: data.roomTypeName,
    ratePlanCode: data.ratePlanCode,
    accountId: data.accountId,
    // commissionPercent: data.commissionPercent,
    specialPrices: [
      {
        specialBeginDate: data.roomDate,
        specialEndDate: data.roomDate,
        otaRoomTypeId: data.otaRoomTypeId,
        otherSellingPrice: data.roomPrice,
        weeks: [data.day]
      }
    ]
  }];
  return {
    accountId: data.accountId,
    jsonData: dataModel
  };
};

export default {
  FormatRoomTypeData,
  FormatSingleRoomOpenCloseData,
  FormatSpecialPriceData
};
