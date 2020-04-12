<template>
  <div class="index">
    <headerBar :onBack="onBack"></headerBar>

    <van-pull-refresh v-model="isPullLoading" @refresh="onRefresh" :head-height="80">
      <template v-if="expireTime > 0">
        <div class="topWrap">
          <!-- 倒计时 -->
          <div class="expire">
            <div>距离活动结束，还剩：</div>
            <van-count-down :time="expireTime" @finish="onExpireFinish">
              <template v-slot="timeData">
                <span class="item">{{ timeData.days | add0 }}</span>天
                <span class="item">{{ timeData.hours | add0 }}</span>:
                <span class="item">{{ timeData.minutes | add0 }}</span>:
                <span class="item">{{ timeData.seconds | add0 }}</span>
              </template>
            </van-count-down>
          </div>
          <div class="activityRule" @click="onShowRule">活动规则</div>
        </div>

        <div :class="['imgStep', { minHeight: isShowCarousel }]">
          <!-- 活动头图 -->
          <div class="imgWrap" v-if="headImg">
            <img v-lazy="headImg" :key="headImg" alt="">
          </div>
          <!-- 轮播信息 -->
          <div class="carousel" v-if="isShowCarousel">
            <van-swipe vertical :autoplay="3000" :show-indicators="false" :touchable="false" :height="screenScale * 23">
              <van-swipe-item v-for="(item, index) in userCarousel" :key="index">
                {{item}}
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>

        <!-- tab栏 -->
        <div class="goodsBox">
          <h4>商品列表</h4>
          <van-tabs
            type="card"
            @click="onTabsClick"
            :swipe-threshold="2"
            color="transparent"
            title-active-color="#000"
            title-inactive-color="#666"
            background="#F2F2F2"
            :offset-top="offsetTop"
            sticky
            :class="{ hideTab: tabList.length <= 1 }"
            v-model="activeBar"
          >
            <van-tab
              v-for="item in tabList"
              :key="item"
              :title="item"
              :name="item"
            >
              <!-- 商品列表ul -->
              <van-list
                v-model="isMoreLoading"
                :finished="isMoreFinished"
                :error.sync="isMoreError"
                @load="getTabGoodsList"
                :immediate-check="false"
                class="goodsList"
                finished-text="没有更多了"
                v-if="item === activeBar"
              >
                <div class="goodsItem" v-for="obj in goodsList" :key="obj.item_id" @click="toGoodsDetail(obj)">
                  <div class="imgWrap">
                    <img alt="" v-lazy="obj.item_base_pic" :key="obj.item_base_pic">
                    <div class="shareTag">需分享{{obj.need_share_num}}人</div>
                    <div class="sellOut" v-if="+obj.stock <= 0">
                      <div class="sellOutTxt">已售罄</div>
                    </div>
                  </div>
                  <div class="titleWrap">
                    <p class="title two-txt-cut">{{obj.item_title}}</p>
                  </div>
                  <div class="price">
                    <span class="yuan">￥</span>
                    <span class="salePrice">{{obj.real_price}}</span>
                    <span class="originPrice">￥{{obj.original_price}}</span>
                  </div>
                </div>
              </van-list>
            </van-tab>
          </van-tabs>
        </div>
      </template>

      <!-- 活动已结束或已下架 -->
      <template v-else>
        <div class="activityDone">
          <div class="txtWrap">
            <h4>活动已下架</h4>
            <p>快去看看有没有别的活动参加吧</p>
          </div>
        </div>
      </template>

    </van-pull-refresh>

    <!-- 分享进程悬浮按钮 -->
    <div class="shareListBtn" @click="toShareList">分享进程</div>

    <!-- 获取活动券 -->
    <div class="ticketGetBtn" @click="toGetTicket">
      <p class="title">获取活动券</p>
      <p class="tip">(当前剩余活动券{{ticketsNum}}张)</p>
    </div>

    <!-- 规则 -->
    <rules v-model="isShowRule"/>
    <!-- 助力成功弹窗 -->
    <helpSuccess v-model="isShowHelpSuc" :gotAmount="gotAmount"/>
  </div>
</template>

<script>
import api from '@/api/index'
import headerBar from '@@/components/headerBar/headerBar'
import platform from '@@/utils/platform'
import rules from '@/components/rules'
import helpSuccess from '@/components/helpSuccess'
import openNative from '@@/utils/openNative'
import callNative from '@@/utils/callNative'
import tools from '@@/utils/tools'
import { mapGetters, mapMutations } from 'vuex'
import adapter from '@@/mixins/adapter'
import recordVisit from './recordVisit'

export default {
  name: 'Index',
  mixins: [adapter, recordVisit],
  data () {
    return {
      isPullLoading: false, // 下拉刷新加载状态
      expireTime: 10000, // 剩余倒计时时间
      headImg: '', // 活动头图
      ticketsNum: 0, // 活动券剩余数
      userCarousel: [], // 用户已购买滚动信息
      activeBar: '', // 激活的当前tab
      tabList: [], // tab数据
      activityId: '', // 活动id
      offsetTop: 0,
      goodsList: [], // 当前tab下的商品数据
      nextFirstRow: 0, // 下一页起始下标，从0开始
      isMoreLoading: false, // 加载更多状态
      isMoreFinished: false, // 加载完全状态
      isMoreError: false, // 加载错误状态
      isShowRule: false, // 是否显示活动规则弹窗
      isShowHelpSuc: false, // 是否显示助力成功弹窗
      gotAmount: '', // 助力成功获得的金额
      pageSize: 20, // 一页数据条数
      screenScale: 1
    }
  },
  computed: {
    ...mapGetters('user', ['userId']),
    isShowCarousel () {
      return this.userCarousel.length >= 3
    }
  },
  filters: {
    // 剩余时间自动补0
    add0 (num) {
      if (+num < 10) {
        return '0' + num
      } else {
        return num
      }
    }
  },
  created () {
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    console.log('urlParams', tools.getQueryObject())
    // 延时执行埋点pv，不延时时第一次进来不触发。。。
    setTimeout(() => {
      TDAPP.onEvent('1分购页面浏览', 'penny_main_view')
    }, 100)
    this.$loading.show()
    this.gethelpSuccessStatus()
    this.getIndex()
    this.saveUserId()
  },
  mounted () {
    setTimeout(() => {
      this.setOffsetTop()
      this.setTabsConHeight()
      this.screenScale = window.innerWidth / 375
    }, 100)
  },
  methods: {
    ...mapMutations('user', ['setUserId']),
    // 初始化数据
    onRefresh () {
      this.activeBar = ''
      this.nextFirstRow = 0
      this.goodsList = []
      // this.isMoreLoading = true
      this.isMoreFinished = false
      this.getIndex(true)
    },
    // 获取首页数据
    getIndex (isRefresh) {
      api.getIndex().then(res => {
        const data = res.data
        this.isPullLoading = false
        this.$loading.hide()
        if (!data.activity_end_time) {
          this.expireTime = -1
          return
        }
        this.activityId = data.activity_id
        this.expireTime = (+data.activity_end_time - +data.current_time) * 1000
        this.ticketsNum = +data.left_coupon_num
        this.headImg = data.activity_header_img
        this.userCarousel = data.roll_message_list || []
        this.tabList = data.item_nav_list
        this.activeBar = this.tabList[0] || ''

        // 假数据
        // for (let i = 1; i < 17; i++) {
        //   data.nav_item_list.item_list.push({
        //     ...data.nav_item_list.item_list[0],
        //     item_id: Math.random()
        //   })
        // }
        // this.expireTime = -1
        this.goodsList = data.nav_item_list.item_list
        this.nextFirstRow = data.nav_item_list.next_first_row

        this.isMoreFinished = +data.nav_item_list.total_num <= this.nextFirstRow

        this.setTabsConHeight()
        if (!isRefresh) {
          this.setTabsItemWidth()
        }
        // 轮播条添加文本溢出隐藏样式
        this.$nextTick(() => {
          const swipeItems = document.querySelectorAll('.carousel .van-swipe-item')
          swipeItems.forEach(v => {
            v.classList.add('one-txt-cut')
          })
        })
      })
    },
    // 加载更多商品
    getTabGoodsList (isInit) {
      if (isInit) {
        this.nextFirstRow = 0
        this.goodsList = []
        this.isMoreLoading = true
        this.isMoreFinished = false
      }
      const params = {
        activity_id: this.activityId,
        nav_title: this.activeBar,
        first_row: this.nextFirstRow,
        fetch_num: this.pageSize
      }
      api.getGoodsList(params).then(res => {
        const data = res.data
        if (isInit) {
          this.goodsList = data.nav_item_list.item_list
        } else {
          this.goodsList = [
            ...this.goodsList,
            ...data.nav_item_list.item_list
          ]
        }
        this.nextFirstRow = data.nav_item_list.next_first_row

        this.isMoreLoading = false
        this.isMoreFinished = +data.nav_item_list.total_num <= this.nextFirstRow
      }).catch(err => {
        console.log(err)
        this.isMoreError = true
      })
    },
    // 倒计时结束
    onExpireFinish () {
      console.log('倒计时结束')
      this.onRefresh()
    },
    // 切换tab栏
    onTabsClick (name, title) {
      // if (this.activeBar === name) return
      // this.activeBar = name
      this.getTabGoodsList(true)
    },
    // 跳转分享进程页
    toShareList () {
      TDAPP.onEvent('分享进程点击', 'penny_main_processclick')
      this.$router.push({
        name: 'ShareList'
      })
    },
    // 返回按钮
    onBack () {
      if (this.$route.name === 'Index') {
        // 关闭webview，去原生页
        callNative.closeWebview()
      } else {
        this.$router.go(-1)
      }
    },
    // 显示活动规则模态框
    onShowRule () {
      this.isShowRule = true
    },
    // 设置tabs栏单个条目的宽度
    setTabsItemWidth () {
      this.$nextTick(() => {
        const tabsEle = document.querySelectorAll('.van-tab')
        tabsEle.forEach(v => {
          v.style.flexBasis = '38%'
        })
      })
    },
    // 设置tab商品列表最低高度
    setTabsConHeight () {
      this.$nextTick(() => {
        const contentEle = document.querySelector('.van-pull-refresh')
        const tabsContentEle = document.querySelector('.van-tabs__content')
        const tabsHeight = window.innerWidth / 375 * 40
        tabsContentEle.style.minHeight = contentEle.offsetHeight - tabsHeight + 'px'
      })
    },
    // 根据运行平台设置tab栏sticky距离顶部高度
    setOffsetTop () {
      this.$nextTick(() => {
        if (platform.isWxmp) {
          this.offsetTop = 0
        } else {
          this.offsetTop = window.innerWidth / 375 * 69
        }
      })
    },
    // 跳转商品详情页
    toGoodsDetail (item) {
      if (+item.stock <= 0) {
        this.$toast('该商品已售罄')
        return
      }
      TDAPP.onEvent('1分购页面商品点击', 'penny_main_pdclick' + '_' + item.item_id)
      openNative.toOneCentGoodsDetail({
        activityId: item.activity_id,
        itemId: item.item_id
      })
    },
    // 保存userId
    saveUserId () {
      const userId = tools.getQueryObject().user_id
      if (userId) {
        this.setUserId(userId)
      }
    },
    // 去庄园游戏
    toGetTicket () {
      TDAPP.onEvent('1分购获取活动券点击', 'penny_main_containclick')
      openNative.toGameManor()
    },
    // 判断url 如果携带helpSuccess且值为'1'，则弹窗
    gethelpSuccessStatus () {
      const helpSuccess = tools.getQueryObject().helpSuccess
      if (helpSuccess === '1') {
        this.isShowHelpSuc = true
      }
    }
  },
  components: { headerBar, rules, helpSuccess }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';

.index {
  height: 100%;
  padding-bottom: 53px;
}
.van-pull-refresh {
  height: 100%;
  overflow: auto;
  // position: relative;

  /deep/ .van-pull-refresh__track {
    height: 100%;
  }
}

.activityDone {
  width: 240px;
  height: 240px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: url('@{imgUrl}activityDone.png') center no-repeat;
  background-size: 100% 100%;

  .txtWrap {
    position: absolute;
    width: 100%;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;

    h4 {
      color: #999;
      padding-bottom: 5px;
    }
    p {
      color: #aaa;
    }
  }
}

.topWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FEF8EC;
  height: 33px;
  line-height: 33px;
  font-size: 12px;
  padding: 0 12px;
  color: #666;

  .expire {
    display: flex;
    align-items: center;

    .van-count-down {
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;

      .item {
        display: block;
        width:19px;
        height:19px;
        background:rgba(51,51,51,1);
        border-radius:3px;
        text-align: center;
        color: #fff;
        margin: 0 3px;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
  .activityRule {
    color: #1B8DFF;
  }
}

.imgStep {
  position: relative;

  &.minHeight {
    min-height: 40px;
  }

  img {
    width: 100%;
    display: block;
  }

  .carousel {
    position: absolute;
    left: 8px;
    top: 8px;

    .van-swipe {
      height: 23px;
      line-height: 23px;
      background-color: #000;
      opacity: .39;
      border-radius: 13px;
      width: 310px;
      padding: 0 10px;
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      color:rgba(255,255,255,1);
    }
  }
}

.goodsBox {
  h4 {
    text-align: center;
    height:40px;
    line-height:45px;
    font-size:18px;
    font-family:PingFangSC-Medium,PingFang SC;
    color:rgba(0,0,0,1);
    background: url('@{imgUrl}tabsTitleBg.png') 112px center no-repeat, url('@{imgUrl}tabsTitleBg.png') 244px center no-repeat;
    background-size: 4.5%;
  }
  .van-tabs {
    /deep/ .van-tabs__wrap {
      padding: 5px 0;
      background: rgb(242, 242, 242);
    }
    /deep/ .van-tabs__nav--card {
      margin: 0;
      border-radius: 0;
      border: none;

      .van-tab {
        border: none;

        &.van-tab--active {
          span {
            width:88px;
            height:30px;
            background:rgba(253,197,83,1);
            border-radius:15px;
            margin: 0 auto;
          }
        }
      }
    }
    /deep/ .van-sticky {
      overflow: hidden;
    }
    &.hideTab {
      /deep/ .van-tabs__wrap {
        display: none;
      }
    }
  }
}

.ticketGetBtn {
  position: fixed;
  left: 50%;
  bottom: 13px;
  transform: translateX(-50%);
  width: 335px;
  background-color: #FF5742;
  border-radius: 20px;
  color: #fff;
  text-align: center;
  padding: 4px 0;

  .title {
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(255,255,255,1);
    padding-bottom: 3px;
  }
  .tip {
    font-size: 11px;
  }
}

.shareListBtn {
  position: fixed;
  bottom: 66px;
  right: -20px;
  z-index: 999;
  background-color: #fff;
  width: 110px;
  height: 35px;
  line-height: 35px;
  border-radius: 20px;
  box-shadow: 0 1px 5px #ccc;
  padding-left: 35px;
  font-size: 12px;
  background: #fff url('@{imgUrl}shareListIcon.png') 6px center no-repeat;
  background-size: 22%;
}

.goodsList {
  display: flex;
  padding: 5px 7px 10px;
  justify-content: space-between;
  flex-wrap: wrap;

  /deep/ & > div {
    width: 100%;
  }
  .goodsItem {
    width: 177px;
    background-color: #fff;
    margin-bottom: 7px;
    border-radius: 6px;
    overflow: hidden;
    padding-bottom: 8px;

    .imgWrap {
      position: relative;
      height: 177px;
      padding: 14px;
      overflow: hidden;

      img {
        width: 100%;
      }
      .shareTag {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background-color: #FF5742;
        font-size: 12px;
        padding: 5px 12px;
        border-radius: 11px;
        color: #fff;
      }
      .sellOut {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        opacity: .74;

        .sellOutTxt {
          font-size: 12px;
          color: #fff;
          padding: 1px 14px 0;
          height: 21px;
          line-height: 21px;
          border-radius: 13px;
          opacity: .8;
          background-color: #000;
          position: absolute;
          left: 50%;
          bottom: 38px;
          transform: translateX(-50%);
        }
      }
    }
    .titleWrap {
      height: 48px;
      overflow: hidden;
      padding: 4px 8px 10px;
      font-size: 12px;
      font-family:PingFangSC-Regular,PingFang SC;
      color: #333;
      line-height: 17px;
    }
    .price {
      padding: 0 8px;

      .yuan {
        color: #FD2A32;
        font-size: 10px;
      }
      .salePrice {
        color: #FD2A32;
        font-size: 14px;
        margin-right: 4px;
      }
      .originPrice {
        text-decoration: line-through;
        color: #999;
        font-size: 11px;
      }
    }
  }
}
</style>
