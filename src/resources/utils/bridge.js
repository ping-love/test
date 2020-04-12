/**
 * js和原生交互基础方法
 */
import wx from './jweixin'
import tools from './tools'
import platform from './platform'

// 设置webview桥接
function setWebViewJsBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (platform.isInnerAndroid) {
    console.log('android, 等待WebViewJavascriptBridgeReady回调')
    document.addEventListener('WebViewJavascriptBridgeReady', function (event) {
      callback(window.WebViewJavascriptBridge)
    }, false)
  } else {
    console.log('ios, 等待WebViewJavascriptBridgeReady回调')
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}

// 注册js方法给安卓原生
function registerAndroidBridge (fnName, callback) {
  setWebViewJsBridge(bridge => {
    bridge.registerHandler(fnName, (data, responseCallback) => {
      callback(data, responseCallback)
    })
  })
}

// 调用安卓原生方法
function callAndroidBridge (fnName, params, callback) {
  params = params || {}
  callback = callback || (() => {})
  setWebViewJsBridge(bridge => {
    console.log('adrBridge', fnName)
    bridge.callHandler(fnName, params, callback)
  })
}

// 调用ios原生方法
function callIosBridge (fnName, params) {
  let paramsStr = ''
  if (params && JSON.stringify(params) !== '{}') {
    paramsStr = `?` + tools.objToUrlParams(params)
  }
  console.log('jsmp', fnName)
  window.location.href = `jsmp://page=${fnName}${paramsStr}`
}

// 跳转ios原生页面
const toIosPage = tools.throttle(toIosPageFn, 1000)
function toIosPageFn (pageName, params) {
  callIosBridge(pageName, params)
}

// 跳转小程序原生页面
const toWxmpPage = tools.throttle(toWxmpPageFn, 1000)
function toWxmpPageFn (url, params, type) {
  type = type || 'navigateTo'
  if (!url.match(/^\//)) {
    url = '/' + url
  }
  wx.miniProgram.getEnv(res => {
    if (res.miniprogram) {
      let paramsStr = ''
      if (params && JSON.stringify(params) !== '{}') {
        paramsStr = '?' + tools.objToUrlParams(params)
      }
      wx.miniProgram[type]({
        url: `${url}${paramsStr}`
      })
    }
  })
}

// 跳转安卓原生页面
const toAndroidPage = tools.throttle(toAndroidPageFn, 1000)
function toAndroidPageFn (url, parameter) {
  parameter = parameter || []
  /* if (params && JSON.stringify(params) !== '{}') {
    Object.keys(params).forEach(v => {
      parameter.push({
        key: v,
        value: params[v]
      })
    })
  } */
  // type:  1.String 2.int 3.boolean 4.double 5.float
  callAndroidBridge('public_jump', { url, parameter })
}

export default {
  // 注册js方法给安卓原生
  registerAndroidBridge,
  // 调用安卓原生方法
  callAndroidBridge,
  // 调用ios原生方法
  callIosBridge,
  // 跳转小程序原生页面
  toWxmpPage,
  // 跳转ios原生页面
  toIosPage,
  // 跳转安卓原生页面
  toAndroidPage
}
