/**
 * 配置部分process.env属性
 */
// 获取子项目名
try {
  if (process.argv[2] === 'lint') return
  process.env.VUE_APP_PROJECT_NAME = process.argv[3].split('---')[1]
} catch (error) {
  console.log(process.argv)
  console.log(error)
  return
}

// 设置NODE_ENV
const runType = process.argv[2]
if (runType === 'serve') {
  // 本地运行 npm run serve
  process.env.NODE_ENV = 'development'
} else if (runType === 'build') {
  // 打包项目 npm run build
  process.env.NODE_ENV = 'production'
}

// 打印
console.log('-----projectName: ' + process.env.VUE_APP_PROJECT_NAME)
console.log('-----serverEnv: ' + process.env.VUE_APP_SERVER_ENV)
