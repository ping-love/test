import http from '@/utils/http'

export default {
  // 获取tab分类列表
  getTabsList: data => http({ name: 'kyk.tbk.getFavoritesList', data }),
  // 获取分类商品列表
  getGoodsList: data => http({ name: 'kyk.tbk.getFavoritesItems', data })
}
