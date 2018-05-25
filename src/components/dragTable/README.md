# dragTable

## 可拖拽的关于时间和房型的表格

### props

|参数|类型|是否必须|说明|备注|
|---|---|---|---|---|
|defaultDate|Date|否|设置默认开始时间|默认当天|
|dateList|Array|是|头部时间数据||
|dataList|Array|是|房型数据||
|dayRange|Number|否|可切换天数|默认20|
|displayAction|Boolean|否|是否显示操作列|默认false|


### slot

|插槽名称|说明|
|-------|---|
|left|左侧列表区域，参数{data}|
|middle-section|"操作"栏区域,参数{data}|
|right-header|右侧顶部时间区域，参数{data}|
|right-section|右侧可滑动区域,参数{data}|

### events

``无``
