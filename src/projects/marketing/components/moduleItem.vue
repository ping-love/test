/**
* 模块配置项
*/
<template>
  <div class='moduleItem'>
    <search :itemObj="itemInfo.moduleInfo" v-if="isSearch"></search>
    <themeModule :itemObj="itemInfo.moduleInfo" v-if="isThemeModule"></themeModule>
    <imgNav :itemObj="itemInfo.moduleInfo" v-if="isImgNav"></imgNav>
    <coupons :itemObj.sync="itemInfo.moduleInfo" v-if="isCoupons"></coupons>
    <moduleNav :itemObj="itemInfo.moduleInfo" v-if="isModuleNav"></moduleNav>
    <recommendNav :itemObj="itemInfo.moduleInfo" v-if="isRecommendNav"></recommendNav>
    <commodityFloor :itemObj="itemInfo.moduleInfo" v-if="isCommodityFloor"></commodityFloor>
    <footerNav :itemObj="itemInfo.moduleInfo" v-if="isFooterNav"></footerNav>
  </div>
</template>

<script>
import search from '@/components/search/search'
import themeModule from '@/components/themeModule/themeModule'
import imgNav from '@/components/imgNav/imgNav'
import coupons from '@/components/coupons/coupons'
import moduleNav from '@/components/moduleNav/moduleNav'
import recommendNav from '@/components/recommendNav/recommendNav'
import commodityFloor from '@/components/commodityFloor/commodityFloor'
import footerNav from '@/components/footerNav/footerNav'
export default {
  name: '',
  data () {
    return {}
  },
  props: {
    itemInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    search,
    themeModule,
    imgNav,
    coupons,
    moduleNav,
    recommendNav,
    commodityFloor,
    footerNav
  },
  created () {

  },
  mounted () {

  },
  computed: {
    isSearch () {
      return this.itemInfo.moduleType === 'dyd-search'
    },
    isThemeModule () {
      return this.itemInfo.moduleType === 'dyd-theme-module'
    },
    isImgNav () {
      return this.itemInfo.moduleType === 'dyd-img-nav'
    },
    isCoupons () {
      return this.itemInfo.moduleType === 'dyd-coupons'
    },
    isModuleNav () {
      return this.itemInfo.moduleType === 'dyd-module-nav'
    },
    isRecommendNav () {
      return this.itemInfo.moduleType === 'dyd-recommend-nav'
    },
    isCommodityFloor () {
      return this.itemInfo.moduleType === 'dyd-commodity-floor'
    },
    isFooterNav () {
      return this.itemInfo.moduleType === 'dyd-footer-nav'
    }
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>

</style>
