/**
 * Created by hanxueqiang on 191220
 * 用于在html里插入script标签代码
 */
const fs = require('fs')
const path = require('path')

/**
 * 接收参数
 * @param {object}
 * condition 分割条件，在此分割点之后插入script
 * useSrc 是否使用src引入外部js，默认false
 * srcUrl 使用src外部js的url路径
 * jsPath 使用内部js时的所有js源文件相对路径(相对于insertJsPlugin.js)
 */
class InsertJsPlugin {
  constructor (options) {
    this.options = options || {}
  }
  apply (compiler) {
    const condition = this.options.condition || ''
    const useSrc = this.options.useSrc || false
    const srcUrl = this.options.srcUrl || ''
    const jsPath = this.options.jsPath || []

    // 定义要插入的script字符串
    let scriptCode = ''
    if (useSrc) {
      // 使用外部js
      scriptCode = `<script src="${srcUrl}"></script>`
    } else {
      // 使用内部js
      jsPath.forEach(v => {
        let str = ''
        try {
          str = fs.readFileSync(path.resolve(__dirname, v), 'utf-8').toString()
        } catch (err) {
          console.log('readFileSync error:', err)
        }
        scriptCode = `<script>${str}</script>`
      })
    }
    // 编译时注入
    compiler.hooks.compilation.tap(
      'compilation',
      compilation => {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
          'htmlWebpackPluginAfterHtmlProcessing',
          htmlPluginData => {
            const htmlStrArr = htmlPluginData.html.toString().split(condition)
            htmlPluginData.html = htmlStrArr[0] + condition + scriptCode + htmlStrArr[1]
          })
      })
  }
}

module.exports = InsertJsPlugin
