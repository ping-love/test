/**
 * 全局路由导航守卫公共方法
 */
import store from '@/store'
import openNative from './openNative'
import { Toast } from 'vant'
import platform from './platform'

// 修改页面title
function setDocumentTitle (to, from) {
  document.title = '点一点'
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
}

// 存储登录状态
function setLoginStatus (to, from) {
  let accessToken = ''
  const nameTag = 'accessToken='
  if (to.query && (to.query.access_token + '' !== 'undefined')) {
    accessToken = to.query.access_token
    store.commit('user/setAccessToken', accessToken)
    window.name = nameTag + accessToken
  } else if (window.name.indexOf(nameTag) > -1 &&
    !platform.isInnerApp &&
    !platform.isWxmp
  ) {
    accessToken = window.name.split(nameTag)[1]
    store.commit('user/setAccessToken', accessToken)
  }
}

// 路由未登录访问权限判断
function judgeNeedLogin (to, from) {
  if (to.meta && to.meta.needLogin) {
    if (store.getters && !store.getters['user/accessToken']) {
      // 跳转登录页
      Toast({
        message: '请先登录',
        duration: 3 * 1000
      })
      openNative.toLogin()
    }
  }
}

export default {
  setDocumentTitle,
  setLoginStatus,
  judgeNeedLogin
}
