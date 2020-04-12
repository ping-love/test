<template>
  <div class="index">
    <div v-for="(itemInfo, index) in moduleOptions" :key="index">
      <moduleItem :itemInfo="itemInfo"></moduleItem>
    </div>
    <div class="lineBox" v-if="isShowFooterNav"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tools from '@@/utils/tools'
import adapter from '@@/mixins/adapter'

import moduleItem from '@/components/moduleItem'

export default {
  name: 'index',
  mixins: [adapter],
  data () {
    return {
      moduleOptions: [],
      isShowFooterNav: false // 是否显示底部导航
    }
  },
  created () {
    console.log('window', window.innerWidth, window.innerHeight)
    console.log('urlParams', tools.getQueryObject())
    this.$loading.show()
  },
  computed: {
    ...mapGetters('user', ['userId'])
  },
  mounted () {
    this.getData()
  },
  methods: {
    setData () {
      let testData = [
        {
          moduleId: '1',
          moduleType: '1',
          moduleInfo: {}
        },
        {
          moduleId: '2',
          moduleType: '2',
          moduleInfo: {
            itemPics: [{ activityId: '001', imgPic: 'https://fakeimg.pl/750x450/' }]
          }
        },
        {
          moduleId: '3',
          moduleType: '7',
          moduleInfo: {
            itemList: [
              { moduleId: '2', imgPic: 'https://fakeimg.pl/75x50/', moduleText: '主题模块' },
              { moduleId: '5', imgPic: 'https://fakeimg.pl/75x50/', moduleText: '商品楼层导航1' },
              { moduleId: '6', imgPic: 'https://fakeimg.pl/75x50/', moduleText: '优惠卷1' },
              { moduleId: '1', imgPic: 'https://fakeimg.pl/75x50/', moduleText: '搜索模块' }
            ]
          }
        },
        {
          moduleId: '4',
          moduleType: '8',
          moduleInfo: {
            itemList: [
              { itemId: '1', imgPic: 'https://fakeimg.pl/75x50/' },
              { itemId: '2', imgPic: 'https://fakeimg.pl/75x50/' },
              { itemId: '3', imgPic: 'https://fakeimg.pl/75x50/' },
              { itemId: '4', imgPic: 'https://fakeimg.pl/75x50/' },
              { itemId: '5', imgPic: 'https://fakeimg.pl/75x50/' }
            ]
          }
        },
        {
          moduleId: '5',
          moduleType: '5',
          moduleInfo: {
            bannerPic: 'https://fakeimg.pl/750x200/',
            itemList: [
              { itemId: '20060', imgPic: 'https://fakeimg.pl/100x150/' },
              { itemId: '20060', imgPic: 'https://fakeimg.pl/100x150/' },
              { itemId: '20060', imgPic: 'https://fakeimg.pl/100x150/' },
              { itemId: '20060', imgPic: 'https://fakeimg.pl/100x150/' },
              { itemId: '20060', imgPic: 'https://fakeimg.pl/100x150/' }
            ]
          }
        },
        {
          moduleId: '6',
          moduleType: '4',
          moduleInfo: {
            itemPics: [
              { couponsId: '60269', gain_pic: 'https://fakeimg.pl/720x150/', not_gain_pic: 'https://fakeimg.pl/720x200/', isGet: false },
              { couponsId: '60276', gain_pic: 'https://fakeimg.pl/720x150/', not_gain_pic: 'https://fakeimg.pl/720x200/', isGet: true }
            ]
          }
        },
        {
          moduleId: '7',
          moduleType: '3',
          moduleInfo: {
            itemPics: [
              { activityId: '111', imgPic: 'https://fakeimg.pl/720x100/' }
            ]
          }
        },
        {
          moduleId: '8',
          moduleType: '3',
          moduleInfo: {
            itemPics: [
              { activityId: '111', imgPic: 'https://fakeimg.pl/360x100/' },
              { activityId: '222', imgPic: 'https://fakeimg.pl/360x100/' }
            ]
          }
        },
        {
          moduleId: '9',
          moduleType: '3',
          moduleInfo: {
            itemPics: [
              { activityId: '111', imgPic: 'https://fakeimg.pl/240x100/' },
              { activityId: '222', imgPic: 'https://fakeimg.pl/240x100/' },
              { activityId: '222', imgPic: 'https://fakeimg.pl/240x100/' }
            ]
          }
        },
        {
          moduleId: '10',
          moduleType: '3',
          moduleInfo: {
            itemPics: [
              { activityId: '111', imgPic: 'https://fakeimg.pl/180x100/' },
              { activityId: '222', imgPic: 'https://fakeimg.pl/180x100/' },
              { activityId: '222', imgPic: 'https://fakeimg.pl/180x100/' },
              { activityId: '222', imgPic: 'https://fakeimg.pl/180x100/' }
            ]
          }
        }
      ]
      return testData
    },
    setModuleData (data) {
      let mid = ''
      switch (data) {
        case '1':
          mid = 'dyd-search'
          break
        case '2':
          mid = 'dyd-theme-module'
          break
        case '3':
          mid = 'dyd-img-nav'
          break
        case '4':
          mid = 'dyd-coupons'
          break
        case '5':
          mid = 'dyd-commodity-floor'
          break
        case '6':
          mid = 'dyd-recommend-nav'
          break
        case '7':
          mid = 'dyd-module-nav'
          break
        case '8':
          mid = 'dyd-footer-nav'
          break
      }
      return mid
    },
    getData () {
      // https://fakeimg.pl/750x100/
      setTimeout(() => {
        this.$loading.hide()
        const moduleData = this.setData()
        console.log(moduleData)
        moduleData.map(val => {
          let mid = {}
          mid = { ...val, moduleType: this.setModuleData(val.moduleType) }
          this.moduleOptions.push(mid)

          if (val.moduleType === '8') this.isShowFooterNav = true // 设置底部导航占位坑的显示与否
        })
        console.log('-module-info', this.moduleOptions)
      }, 1000)
    }
  },
  components: {
    moduleItem
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';
@import '../../assets/styles/variables.less';
.index {
  position: relative;
  height: 100%;
}
.lineBox {
  width: 100%;
  height: @footerHeight;
}
</style>
