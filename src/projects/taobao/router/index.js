import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Index = () => import(/* webpackChunkName: "index" */ '@/views/index/index')
const GoodsDetail = () => import(/* webpackChunkName: "goodsDetail" */ '@/views/goodsDetail/goodsDetail')
const Oauth = () => import(/* webpackChunkName: "oauth" */ '@/views/oauth/oauth')

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    meta: {
      title: '购物送红包'
    }
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/oauth',
    name: 'Oauth',
    component: Oauth,
    meta: {
      title: '授权成功'
    }
  }
  // 在这里添加其他路由
  // ......
]

const Page404 = () => import(/* webpackChunkName: "404" */ '@/views/errorPage/404.vue')
const errorPage = [
  {
    path: '*',
    name: 'page404',
    component: Page404
  }
]

const routerConfig = {
  routes: routes.concat(errorPage)
}

if (+process.env.VUE_APP_HISTORY_OPEN) {
  const projectName = process.env.VUE_APP_PROJECT_NAME
  routerConfig.mode = 'history'
  routerConfig.base = `${process.env.VUE_APP_HISTORY_BASE}/${projectName}`
}

const router = new VueRouter(routerConfig)

export default router
