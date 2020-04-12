import http from '@/utils/http'

export default {
  // 获取普通承接页数据
  getTemplateOne: data => http({ name: 'kyk.activityPageV1.getBasicPage', data }),
  // 获取全图承接页数据
  getTemplateTwo: data => http({ name: 'kyk.activityPageV1.getFullImagePage', data })
}
