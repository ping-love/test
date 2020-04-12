import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const TemplateOne = () => import(/* webpackChunkName: "templateOne" */ '@/views/templateOne/templateOne')

const routes = [
  {
    path: '/',
    redirect: '/templateOne'
  },
  {
    path: '/templateOne',
    name: 'TemplateOne',
    component: TemplateOne,
    meta: {
      title: '活动页一'
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
