<template>
  <div class="index">
    <headerBar :headTitle="title" :onBack="onBack"></headerBar>

    <!-- banner图 -->
    <div class="bannerTemp">
      <img :src="bannerData['img_url']" alt="" />
    </div>
    <!-- 优惠卷 -->

    <!-- 横排单列商品 -->
    <template v-if="couponList.length > 0">
      <van-list
        v-model="isMoreloading"
        finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >

      </van-list>
    </template>

    <!-- 横排三个商品 -->

    <van-button type="info" @click="onClick">About</van-button>
  </div>
</template>

<script>
import headerBar from '@@/components/headerBar/headerBar'
import { mapGetters } from 'vuex'
import tools from '@@/utils/tools'
import bridge from '@@/utils/bridge'
import adapter from '@@/mixins/adapter'
import api from '@/api/index'

export default {
  name: 'index',
  mixins: [adapter],
  data () {
    return {
      title: '', // 标题
      isNeedShare: false, // 是否有分享按钮

      bannerData: {}, // banner图

      couponsBg: '', // 优惠卷组件背景
      couponList: [], // 优惠卷列表

      productOneBg: '',
      oneColumnList: [], // 一列商品

      activeId: '', // 选中的tabId
      tabList: [], // tab数据
      threeColumnList: [], // 三列商品
      pageId: 0,
      first_row: 0,

      // 优惠卷
      showCouponNum: 6,
      showCouponBtn: 6,
      // 商品类型一
      titleData: {},
      productOneList: [],
      showProductOneNum: 4,
      showProductOneBtn: 4,
      // 商品类型二
      seeMoreBool: false,

      navList: [],
      productTwoList: [],
      initShowNum: 9,
      updateShowNum: 9,
      classfiyType: '0',
      isSeeMore: false,

      tipMessage: '提示信息',
      isShow: false,
      widthNum: '2.0rem',
      isLoad: false, // 更多商品是否加载完成

      startY: 0, // 滑动前开始距离
      direction: '',
      sPoints: [], // scroll滚动点集合
      isReq: true, // 是否能够请求接口
      isNoData: false, // 是否没有更多数据了
      isSlideBottom: false, // 是否滑到底部

      // 优化
      totalData: {}, // 所有分类的数据
      productColorObj: { navFont: '', navActFont: '', navBg: '', mainBg: '' }, // 所有的颜色对象

      browserEnv: '',
      isLoading: false // 是否正在加载
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
    // 返回按钮
    onBack () {
      if (this.$route.name === 'Index') {
        // 关闭webview，去原生页
        bridge.closeWebview()
      } else {
        this.$router.go(-1)
      }
    },
    onClick () {
      this.$toast('aaa')
      this.$router.push({
        name: 'About'
      })
    },
    getData () {
      // 1572956946
      const param = {
        page_id: '1572956946'
      }
      // 获取数据，标题
      api.getTemplateOne(param).then(res => {
        this.$loading.hide()
        const data = res.data
        console.log('-one-data-', data)
        this.title = data.page_title
        this.bannerData = data.master_img
      })
    }
  },
  components: {
    headerBar
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';
@import url('./templateOne.less');
.index {
  height: 100%;
}
</style>
