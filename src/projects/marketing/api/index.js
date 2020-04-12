import http from '@/utils/http'

export default {
  // 获取落地页首页数据
  getIndex: data => http({ name: 'kyk.oneCoinV2.index', data }),
  // 获取分类商品列表
  getGoodsList: data => http({ name: 'kyk.oneCoinV2.getItemListByNav', data })
}
