import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Index = () => import(/* webpackChunkName: "index" */ '@/views/index/index')
const About = () => import(/* webpackChunkName: "about" */ '@/views/about/about')

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
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于',
      needLogin: 1
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
