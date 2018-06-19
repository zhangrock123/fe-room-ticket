// 订单状态选项数据
const OrderStatusOptionConfig = () => {
  return {
    0: '未处理',
    1: '已接受（已分房）',
    2: '已拒绝',
    3: '已取消',
    4: '验证失败',
    5: '已接受（未分房）',
    6: '已入住',
    7: '已退房',
    8: 'NOSHOW（未到店）',
    9: '变更已确认'
  };
};

// 查询日期类型选项数据
const OrderTypeOptionConfig = () => {
  return {
    CREATE: '下单日期',
    CHECK_IN: '入住日期',
    CHECK_OUT: '离店日期'
  };
};

// 查询类型选项数据
const QueryTypeOptionConfig = () => {
  return {
    1: '客栈名称',
    2: '分销商订单号',
    3: 'oms订单号',
    4: '目的地',
    5: '客户经理'
  };
};

export default {
  OrderStatusOptionConfig,
  OrderTypeOptionConfig,
  QueryTypeOptionConfig
};
