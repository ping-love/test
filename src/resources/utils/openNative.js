/**
 * 跳转原生页面方法集合
 *
 * bridge.js里做了节流处理，一秒内只能触发一次
 */
import platform from './platform'
import bridge from './bridge'

// 判断平台调用相应的原生交互方法
function toNative (wxmpData, androidData, iosData) {
  if (platform.isWxmp && wxmpData) {
    // 小程序参数：url, params, isSwitchTab
    bridge.toWxmpPage(...wxmpData)
  } else if (platform.isInnerAndroid && androidData) {
    // 安卓参数：url, params (注意定义好参数字段值的数据类型)
    bridge.toAndroidPage(...androidData)
  } else if (platform.isInnerIos && iosData) {
    // ios参数：pageName, params
    bridge.toIosPage(...iosData)
  }
}

// 跳转点点庄园游戏页
const toGameManor = () => {
  const wxmpData = [
    '/pages/Body/pages/manors/manors'
  ]
  const androidData = [
    '/main/ManorActivity'
  ]
  const iosData = [
    'dydGoGameManor'
  ]
  toNative(wxmpData, androidData, iosData)
}

// 一分购 商品详情页
const toOneCentGoodsDetail = ({ itemId, activityId }) => {
  const wxmpData = [
    '/pages/Body/pages/robDetails/robDetails',
    {
      id: itemId,
      activityId: activityId
    }
  ]
  const androidData = [
    '/mall/PennyBuyGoodsDetailActivity',
    [{
      'key': 'item_id',
      'value': itemId,
      'type': 1
    }, {
      'key': 'activity_id',
      'value': activityId,
      'type': 1
    }]
  ]
  const iosData = [
    'oneCoinGoodsDetail',
    {
      item_id: itemId,
      activity_id: activityId
    }
  ]
  toNative(wxmpData, androidData, iosData)
}

// 订单详情页
const toOrderDetail = ({ orderItemId, orderStatus }) => {
  console.log('order_detail:', orderItemId, orderStatus)
  const wxmpData = [
    '/pages/User/pages/orderdetail/orderdetail',
    {
      id: orderItemId,
      order_status: orderStatus
    }
  ]
  const androidData = [
    '/me/OrderDetailActivity',
    [{
      'key': 'id',
      'value': orderItemId,
      'type': 1
    }, {
      'key': 'order_status',
      'value': '1',
      'type': 1
    }]
  ]
  const iosData = ['oneCoinOrderDetail', {
    order_item_id: orderItemId
  }]
  toNative(wxmpData, androidData, iosData)
}

// 一分购 分享详情
const toOneCentShareDetail = ({ orderId }) => {
  const wxmpData = [
    '/pages/Body/pages/cent/cent',
    {
      id: orderId
    }
  ]
  const androidData = [
    '/mall/PennyBuyDetailActivity',
    [{
      'key': 'order_id',
      'value': orderId,
      'type': 1
    }]
  ]
  const iosData = ['oneCoinShareDetail', {
    order_id: orderId
  }]
  console.log(wxmpData, androidData, iosData)
  toNative(wxmpData, androidData, iosData)
}

// 一分购 支付页（安卓，ios）
const toPayPage = ({ orderId }) => {
  const wxmpData = [
    '/pages/Body/pages/pay/pay',
    {
      id: orderId,
      price: '0.01',
      text: '一分购订单'
    }
  ]
  const androidData = [
    '/me/PaymentActivity',
    [{
      'key': 'state',
      'value': 4,
      'type': 2
    }, {
      'key': 'id',
      'value': orderId,
      'type': 1
    }, {
      'key': 'price',
      'value': '0.01',
      'type': 1
    }]
  ]
  const iosData = [
    'oneCoinPay',
    {
      order_id: orderId
    }
  ]
  console.log(wxmpData, androidData, iosData)
  toNative(wxmpData, androidData, iosData)
}

// 登录页
const toLogin = () => {
  const wxmpData = [
    '/pages/login/login'
  ]
  const androidData = [
    '/main/LoginActivity'
  ]
  const iosData = [
    'dydLogin'
  ]
  toNative(wxmpData, androidData, iosData)
}

// 搜索首页
const toSearchIndex = () => {
  const wxmpData = [
    '/pages/Body/pages/search/search'
  ]
  const androidData = [
    '/mall/SearchActivity'
  ]
  const iosData = [
    'dydMallSearch'
  ]
  toNative(wxmpData, androidData, iosData)
}

// 返利常见问题详情页
const toQuestionDetail = () => {
  const wxmpData = [
    '/pages/User/pages/giveHelp/giveHelp',
    {
      id: 4,
      title: '商城指南'
    }
  ]
  const androidData = [
    '/me/HelpCenterDetailActivity',
    [{
      'key': 'title',
      'value': '商城指南'
    }, {
      'key': 'id',
      'value': '4'
    }]
  ]
  const iosData = [
    'dydRebateExplain'
  ]
  toNative(wxmpData, androidData, iosData)
}

// 小程序原生引导下载页
const toWxmpDownload = () => {
  const wxmpData = [
    '/pages/User/pages/giveHelp/giveHelp',
    {
      type: 'download'
    }
  ]
  toNative(wxmpData, '', '')
}

// 安卓专用的淘宝客商品详情webview页

export default {
  // 跳转点点庄园游戏页
  toGameManor,
  // 一分购 商品详情页
  toOneCentGoodsDetail,
  // 订单详情页
  toOrderDetail,
  // 一分购 分享详情
  toOneCentShareDetail,
  // 一分购 支付页（安卓，ios）
  toPayPage,
  // 登录页
  toLogin,
  // 搜索首页
  toSearchIndex,
  // 返利常见问题详情页
  toQuestionDetail,
  // 小程序原生引导下载页
  toWxmpDownload
}
