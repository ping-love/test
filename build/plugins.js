/**
 * Created by hanxueqiang on 191220
 * plugins配置
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const InsertJsPlugin = require('./insertJsPlugin.js')
// 定义是否是线上生产环境
const isOnline = process.env.NODE_ENV === 'production' &&
  process.env.VUE_APP_SERVER_ENV === 'prod'

// js压缩
const uglifyJsPlugin = new UglifyJsPlugin({
  uglifyOptions: {
    compress: {
      drop_console: true,
      pure_funcs: ['console.log']
    },
    output: {
      comments: false
    }
  },
  parallel: true
})

// 埋点talkingData
// let srcBase = 'https://jic.talkingdata.com/app/h5/v1'
// let appid = isOnline ? '2462188C2DDD4709B00CC7B93BEA5473' : 'F384457941C2454FA1008DDC4465EFD8'
// let vn = process.env.VUE_APP_SERVER_ENV
// let vc = '1.0'
// const insertTalkingData = new InsertJsPlugin({
//   condition: '</body>',
//   useSrc: true,
//   srcUrl: `${srcBase}?appid=${appid}&vn=${vn}&vc=${vc}`
// })
const insertTalkingData = new InsertJsPlugin({
  condition: '<body>',
  jsPath: ['./talkingData.js']
})

// base插件
let plugins = [
  insertTalkingData
]

// 线上环境启用的插件
if (isOnline) {
  plugins.push(uglifyJsPlugin)
}

module.exports = plugins
