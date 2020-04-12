import http from '@/utils/http'

export default {
  // 获取淘宝商品详情
  getGoodsDetail: data => http({ name: 'kyk.tbk.tbItemInfo', data })
}
