/**
 * vconsole调试工具
 */
import platform from './platform'

;(function () {
  // 本地开发模式关闭
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (isDevelopment && !platform.isWxmp && !platform.isInnerAndroid && !platform.isInnerIos) return
  // 打包线上生产环境时关闭
  const isOnline = process.env.NODE_ENV === 'production' && process.env.VUE_APP_SERVER_ENV === 'prod'
  if (isOnline) return
  // 线上域名环境时关闭
  const isOnlineUrl = /\/\/app\.51k1k/.test(window.location.origin)
  if (isOnlineUrl) return

  // 动态引入，利于chunk分离
  import(/* webpackChunkName: "vconsole" */ 'vconsole').then(res => {
    const VConsole = res.default
    // eslint-disable-next-line no-new
    new VConsole()
  })
})()
