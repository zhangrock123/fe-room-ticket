// 酒店审核状态
export function onlineStatus(val) {
  let res = '未知状态';
  val = val * 1;
  switch (val) {
    case 0:
      res = '未上架';
      break;
    case 1:
      res = '已上架';
      break;
  }
  return res;
}
