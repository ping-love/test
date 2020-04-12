/**
 * Created by hanxueqiang on 19/11/13
 */
require('./build/processEnv.js')
const Path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Plugins = require('./build/plugins')

const projectName = process.env.VUE_APP_PROJECT_NAME

module.exports = {
  publicPath: +process.env.VUE_APP_HISTORY_OPEN
    ? `${process.env.VUE_APP_HISTORY_BASE}/${projectName}`
    : (process.env.NODE_ENV === 'production' ? './' : '/'),
  outputDir: `dist/${projectName}`,
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',

  // 开发环境服务配置
  devServer: {
    host: '0.0.0.0',
    port: 8899,
    open: false,
    progress: false,
    proxy: {
      [process.env.VUE_APP_PROXY_CODE]: {
        target: process.env.VUE_APP_SERVER_URL,
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          ['^' + `${process.env.VUE_APP_PROXY_CODE}/${process.env.VUE_APP_SERVER_ENV}`]: ''
        }
      }
    }
  },

  // 添加webpack配置
  configureWebpack: config => {
    // 定义快捷路径标识
    const myAlias = {
      '@@': Path.resolve(__dirname, './src/resources'),
      '@': Path.resolve(__dirname, './src/projects/', projectName),
      'public': Path.resolve(__dirname, './public')
    }
    // 性能提示
    let myPerformance = {}
    if (process.env.NODE_ENV === 'production') {
      myPerformance = {
        hints: 'warning',
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000
      }
    }
    // 更新config
    config.plugins = [...config.plugins, ...Plugins]
    config.resolve.alias = { ...config.resolve.alias, ...myAlias }
    config.performance = { ...config.performance, ...myPerformance }
  },

  // 修改webpack配置
  chainWebpack: config => {
    config.entry('app').clear().add(`./src/projects/${projectName}/main.js`)
    config.plugin(`html`).use(HtmlWebpackPlugin, [{
      template: `./src/projects/${projectName}/index.html`,
      templateParameters: {
        BASE_URL: '/',
        PROJECT_NAME: projectName,
        FAVICON_PATH: process.env.NODE_ENV === 'development' ? './dev.ico' : './favicon.ico'
      }
    }]).before('preload')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  }

  // 第三方插件选项
  // pluginOptions: {}
}
