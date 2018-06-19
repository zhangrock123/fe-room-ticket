// 新增时候，选择了某个合作酒店后的初始化数据模型
const FormatterCooperationHotelData = (coHotelData, originData) => {
  return {
    coHotel: originData.coHotel,
    hotelName: coHotelData.name,
    receptionTel: coHotelData.frontPhone,
    bossMobile: coHotelData.telephone,
    roomCount: coHotelData.roomNum,
    openYear: coHotelData.openTime,
    decorationYear: coHotelData.lastDecorateTime,
    introduction: coHotelData.introduction,
    addressInfo: coHotelData.address,
    destinationCode: coHotelData.regionCode,
    imageList: coHotelData.imgList || [],
    provinceCode: coHotelData.provCode,
    cityCode: coHotelData.cityCode,
    areaCode: coHotelData.disCode,
    geoInfo: originData.geoInfo,
    facilityList: coHotelData.facilities
  };
};

// 编辑时候，数据初始化模型
const FormatterDefaultHotelData = (defaultData) => {
  return {
    coHotel: _FormatterCoHotelData(defaultData),
    hotelName: defaultData.name,
    receptionTel: defaultData.frontPhone,
    bossMobile: defaultData.telephone,
    roomCount: defaultData.roomNum,
    openYear: new Date(defaultData.openTime, 1, 1),
    decorationYear: new Date(defaultData.lastDecorateTime, 1, 1),
    introduction: defaultData.introduction,
    addressInfo: defaultData.address,
    destinationCode: defaultData.regionCode * 1,
    imageList: defaultData.imgList || [],
    provinceCode: defaultData.provCode + '',
    cityCode: defaultData.cityCode + '',
    areaCode: defaultData.disCode + '',
    geoInfo: _FormatterGeoInfo(defaultData),
    facilityList: defaultData.facilities
  };
};

// 创建/编辑酒店详情的提交参数
const FormatterSubmitData = (formData, mapLatLon, hotelInfo = {}) => {
  let coHotel = formData.coHotel || {};
  let geoInfo = formData.geoInfo || {};
  let param = {};
  let imgList = [];
  formData.imageList.forEach(v => {
    v.imgId && imgList.push({
      ...v
    });
  });
  param = {
    imgList: imgList,
    brandName: coHotel.name,
    pmsId: coHotel.id,
    name: formData.hotelName,
    psbCode: coHotel.psbCode,
    frontPhone: formData.receptionTel,
    telephone: formData.bossMobile,
    wechat: '',
    roomNum: formData.roomCount,
    openTime: typeof (formData.openYear) == 'object' ? formData.openYear.getFullYear() : formData.openYear,
    lastDecorateTime: typeof (formData.decorationYear) == 'object' ? formData.decorationYear.getFullYear() : formData.decorationYear,
    introduction: formData.introduction,
    countryType: 1,
    provCode: geoInfo.provinceCode,
    provName: geoInfo.provinceName,
    cityCode: geoInfo.cityCode,
    cityName: geoInfo.cityName,
    disCode: geoInfo.areaCode,
    disName: geoInfo.areaName,
    address: formData.addressInfo,
    baiduLon: mapLatLon[0],
    baiduLat: mapLatLon[1],
    regionCode: formData.destinationCode,
    facilities: [...formData.facilityList]
  };
  hotelInfo && hotelInfo.fisId && (param.fisId = hotelInfo.fisId);

  return param;
};


// 三级联动数据模型（省市区）
const _FormatterGeoInfo = (data) => {
  return {
    provinceName: '',
    provinceCode: data.provCode + '',
    cityName: '',
    cityCode: data.cityCode + '',
    areaName: '',
    areaCode: data.disCode + ''
  };
};

// 合作酒店数据模型
const _FormatterCoHotelData = (data) => {
  return {
    id: data.pmsId,
    name: data.brandName,
    psbCode: data.psbCode
  };
};

// 检查提交参数合法性
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  res.status = !(
    (!data.coHotel && (res.msg = '请选择合作酒店！')) ||
    (!data.hotelName && (res.msg = '请输入酒店名称！')) ||
    (!data.receptionTel && (res.msg = '请输入前台电话！')) ||
    (!data.bossMobile && (res.msg = '请输入老板手机号！')) ||
    (!data.roomCount && (res.msg = '请输入房间数量！')) ||
    (!data.openYear && (res.msg = '请选择开业年份！')) ||
    (!data.decorationYear && (res.msg = '请选择装修年份！')) ||
    (!data.introduction && (res.msg = '请输入酒店简介！')) ||
    (!data.geoInfo.provinceCode && (res.msg = '请选择省份！')) ||
    (!data.geoInfo.cityCode && (res.msg = '请选择城市！')) ||
    (!data.geoInfo.areaCode && (res.msg = '请选择区域！')) ||
    (!data.addressInfo && (res.msg = '请输入地址信息！')) ||
    (!data.destinationCode && (res.msg = '请选择目的地！')) ||
    (!data.facilityList.length && (res.msg = '请选择酒店设施！'))
  );
  return res;
};

// 获取弹出框表格配置数据
const FormatterOptionDialogColumn = () => {
  return [
    {
      title: '酒店id',
      column: 'id',
      width: '25%'
    },
    {
      title: '名称',
      column: 'name',
      width: '50%'
    },
    {
      title: 'psb编码',
      column: 'psbCode'
    }
  ];
};

// 拼接地图查询的关键字
const FormatterSearchMapData = (data) => {
  let geoInfo = data.geoInfo;
  let provinceName = geoInfo.provinceName;
  let cityName = geoInfo.cityName;
  let areaName = geoInfo.areaName;
  let addressInfo = data.addressInfo;
  let searchKeyword = '';

  provinceName &&
    (searchKeyword += provinceName) &&
    cityName &&
    (searchKeyword += cityName) &&
    areaName &&
    (searchKeyword += areaName) &&
    addressInfo &&
    (searchKeyword += addressInfo);
  return searchKeyword;
};

export default {
  FormatterCooperationHotelData,
  FormatterDefaultHotelData,
  FormatterSubmitData,
  CheckParamStatus,
  FormatterOptionDialogColumn,
  FormatterSearchMapData
};
