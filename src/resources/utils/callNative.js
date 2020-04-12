/**
 * 调用原生方法集合
 */
import platform from './platform'
import bridge from './bridge'
import tools from './tools'

// 关闭webview（返回到原生页面）
function closeWebview () {
  if (platform.isInnerAndroid) {
    bridge.callAndroidBridge('dydAllianceActivity')
  } else if (platform.isInnerIos) {
    bridge.callIosBridge('dydpop')
  }
}

// 调用原生分享 (只分享到微信小程序卡片)
function openShare ({ path, title, desc, pic }) {
  if (platform.isInnerAndroid) {
    bridge.callAndroidBridge('dydWxShare', {
      path, // 小程序页面路径，可带参数
      title, // 分享卡片标题
      desc, // 分享卡片描述
      pic // 分享卡片图片
    })
  } else if (platform.isInnerIos) {
    bridge.callIosBridge('dydGoodsShare', {
      path: path,
      title: title,
      item_desc: desc,
      wechat_share_pic: pic
    })
  }
}

// 淘宝客商品详情页去购买
function toTbBuy ({ itemUrl }) {
  if (platform.isInnerAndroid) {
    bridge.callAndroidBridge('dydToTbBuy', {
      item_url: itemUrl // 客户端要在淘宝app打开的地址
    })
  } else if (platform.isInnerIos) {
    bridge.callIosBridge('dydPushTaobao', {
      item_url: itemUrl
    })
  }
}

// 新开一个通用的webview
function openNewWebview ({ url }) {
  if (platform.isInnerAndroid) {
    // 安卓待添加
  } else if (platform.isInnerIos) {
    bridge.callIosBridge('dydOpenNewWeb', {
      url: encodeURI(url) // 根据url参数判断是否显示客户端顶部导航栏
    })
  } else if (platform.isWxmp) {
    bridge.toWxmpPage(
      '/pages/Body/pages/web/web',
      {
        id: url
      }
    )
  }
}

// 设置原生顶部导航栏的标题
function setHeaderTitle ({ title }) {
  if (platform.isInnerAndroid) {
    bridge.callAndroidBridge('dydChangeTitle', {
      title // 顶部导航栏标题
    })
  } else if (platform.isInnerIos) {
    // ios待添加
  }
}

// 新开webview打开淘宝客商品详情页
function openTbGoodsDetail ({ accessToken, itemId, redPacket, couponAmount, actualPrice, itemUrl }) {
  let query = {
    access_token: accessToken,
    item_id: itemId,
    red_packet: redPacket,
    coupon_amount: couponAmount,
    actual_price: actualPrice,
    item_url: encodeURIComponent(itemUrl)
  }
  const url = `${window.location.origin}/h5/taobao/#/goodsDetail?${tools.objToUrlParams(query)}`
  if (platform.isInnerAndroid) {
    // 安卓客户端是使用的单独的webview容器处理的
    bridge.toAndroidPage(
      '/mall/TaobaoWebViewCommonActivity',
      [{
        'key': 'url',
        'value': url,
        'type': 1
      }]
    )
  } else {
    openNewWebview({ url })
  }
}

export default {
  // 关闭当前webview
  closeWebview,
  // 调用原生分享 (只分享到微信小程序卡片)
  openShare,
  // 淘宝客商品详情页去购买
  toTbBuy,
  // 新开一个通用的webview
  openNewWebview,
  // 设置原生顶部导航栏的标题
  setHeaderTitle,
  // 新开webview打开淘宝客商品详情页
  openTbGoodsDetail
}
