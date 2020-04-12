
var isOnline = /\/\/app\.51k1k/.test(window.location.origin)
var srcBase = 'https://jic.talkingdata.com/app/h5/v1'
var appid = isOnline ? '2462188C2DDD4709B00CC7B93BEA5473' : 'F384457941C2454FA1008DDC4465EFD8'
var vn = isOnline ? 'prod' : 'test'
var vc = '1.0'

var bodyEle = document.documentElement
var scriptEle = document.createElement('script')
scriptEle.setAttribute('src', srcBase + '?appid=' + appid + '&vn=' + vn + '&vc=' + vc)
bodyEle.appendChild(scriptEle)
