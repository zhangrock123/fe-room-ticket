// 格式化图片剪切参数
const FormatterImageCutModel = (data) => {
  return {
    imgId: data.imgId || '',
    imgName: data.imgName || '',
    imgUrl: data.imgUrl || '',
    x: Math.round(data.x || 0),
    y: Math.round(data.y || 0),
    width: Math.round(data.width),
    height: Math.round(data.height),
    type: data.type || 1,
    seq: data.seq || 1,
    innId: data.innId || '',
    roomTypeId: data.roomTypeId || '',
    isCover: data.isCover || 0
  };
};

// 提交参数验证
const CheckParamStatus = (data) => {
  let res = { status: false, msg: '' };
  res.status = !(
    (!data.imgName && (res.msg = '图片名称不能为空！')) ||
    (!data.imgUrl && (res.msg = '图片URL不能为空！')) ||
    (data.x < 0 && (res.msg = '图片剪切x坐标不能为空!')) ||
    (data.y < 0 && (res.msg = '图片剪切y坐标不能为空!')) ||
    (!data.width && (res.msg = '图片剪切宽度不能为空!')) ||
    (!data.height && (res.msg = '图片剪切长度不能为空!')) ||
    (!data.type && (res.msg = '图片类型不能为空!')) // type 1=酒店图片，2=房型图片
  );
  return res;
};



export default {
  FormatterImageCutModel,
  CheckParamStatus
};
