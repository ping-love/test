<template>
  <div class="goodsDetail" :class="{ isWxmp: isWxmp }">
    <!-- 头部 -->
    <div class="header">
      <div class="statusBar"></div>
      <i class="iconLeft" @click="onBack"></i>
      <i class="iconShare" @click="onShare"></i>
    </div>

    <!-- <van-pull-refresh v-model="isPullLoading" @refresh="onRefresh" :head-height="80"> -->
    <div class="content" id="content">
      <!-- 商品图 -->
      <div class="imgWrap">
        <van-swipe @change="onSwipeChange">
          <van-swipe-item v-for="(item, index) in goodsData.small_images" :key="index">
            <img v-lazy="item" />
          </van-swipe-item>
          <div class="custom-indicator" slot="indicator">
            {{ currentImgIndex + 1 }} / {{goodsData.small_images.length}}
          </div>
        </van-swipe>
      </div>

      <!-- 标题 -->
      <div class="titleWrap">
        <p class="title two-txt-cut">{{goodsData.item_title}}</p>
      </div>

      <!-- 价格 -->
      <div class="price">
        <p class="taobaoPrice">
          <span v-if="hasCoupon">￥{{goodsData.consult_price}}淘宝参考价</span>
        </p>
        <p class="newPrice">
          <span class="yuan">￥</span>
          <span class="actualPrice">{{goodsData.actual_price}}</span>
          <span class="txtTag"></span>
        </p>
      </div>

      <!-- 优惠券栏 -->
      <div class="couponBar" @click="onShowCouponModal">
        <div class="couponBox">
          <div class="couponBoxLeft">
            <p class="couponInfo" v-if="hasCoupon">
              <span class="couponTag">优惠券</span>
              <span class="couponAmount">领券立减￥{{goodsData.coupon_amount}}</span>
            </p>
            <p class="redBag">
              <span class="redBagTag">额外送红包</span>
              <span class="redBagTxt">平台额外送红包</span>
              <span class="redBagAmount">￥{{goodsData.red_packet}}</span>
            </p>
          </div>
          <div class="couponBoxRight">
            <p>
              <span class="rightTxt">约省</span>
              <span class="rightAmount">￥{{goodsData.total_discount}}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="divide">
        <i class="line"></i>
        <span>商品详情</span>
        <i class="line"></i>
      </div>

      <!-- 商品详情图 -->
      <div class="imgDetail">
        <img
          :src="item"
          alt=""
          v-for="(item, index) in goodsData.item_detail"
          :key="index"
          v-lazy="item"
        />
      </div>
    <!-- </van-pull-refresh> -->
    </div>

    <!-- 购买按钮 -->
    <div class="buyBox">
      <button @click="onBuy">
        立即{{hasCoupon ? '领券' : ''}}购买（省{{goodsData.total_discount}}元）
      </button>
    </div>

    <!-- 点击优惠券弹窗 -->
    <transition name="slideToUp">
      <div class="modalCoupon" v-show="isShowCouponModal">
        <div class="closeBtn" @click="onCloseCouponModal"></div>
        <div class="title">
          比淘宝直接买约省<span class="amountTxt">￥{{goodsData.total_discount}}</span>
        </div>
        <div class="detail">
          <div class="detailCoupon" v-if="hasCoupon">
            <div class="detailCouponL">淘宝隐藏优惠券</div>
            <div class="detailCouponR">
              省<span class="amountTxt">￥{{goodsData.coupon_amount}}</span>
            </div>
          </div>
          <div class="detailRedBag">
            <div class="detailRedBagL">
              平台额外送红包<span class="amountTxt">￥{{goodsData.red_packet}}</span>（可提现）
            </div>
            <div class="detailRedBagR">
              省<span class="amountTxt">￥{{goodsData.red_packet}}</span>
            </div>
          </div>
        </div>
        <div class="modalDivide">
          <i class="line"></i>
          <span>省钱购买流程</span>
          <i class="line"></i>
        </div>
        <div class="flow">
          <div class="circle circle1">
            <div>
              <p>立即</p>
              <p>{{hasCoupon ? '领券' : '购买'}}</p>
            </div>
          </div>
          <div class="arrow"></div>
          <div class="circle circle2" v-if="hasCoupon">
            <div>
              <p>券后支付</p>
              <p><span>￥</span>{{goodsData.post_coupon_price}}</p>
            </div>
          </div>
          <div class="arrow" v-if="hasCoupon"></div>
          <div class="circle circle3">
            <div>
              <p>红包到账</p>
              <p><span>￥</span>{{goodsData.red_packet}}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 跳转中弹窗 -->
    <div class="modalJump" v-if="isShowJumpModal">
      <div class="iconBox">
        <i class="dyd"></i>
        <div class="progressBox">
          <p class="progress" :class="{ jumping: isJumping }">
            <i class="done"></i>
          </p>
          <p class="tip">即将前往</p>
        </div>
        <i class="taobao"></i>
      </div>
      <div class="mid">淘宝下单完成</div>
      <div class="bot">
        领取<span>{{goodsData.red_packet}}元</span>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div
      class="mask"
      :class="{ isMaskJump: isShowJumpModal }"
      v-show="isShowCouponModal || isShowJumpModal"
      @click="onCloseModal"
    ></div>

    <!-- 返回顶部 -->
    <toTop selector="#content"/>
  </div>
</template>

<script>
import callNative from '@@/utils/callNative'
import openNative from '@@/utils/openNative'
import platform from '@@/utils/platform'
import tools from '@@/utils/tools'
import wx from '@@/utils/jweixin'
import api from '@/api/goodsDetail'
import { mapGetters } from 'vuex'
import toTop from '@@/components/toTop/toTop'

export default {
  data () {
    return {
      goodsData: {
        small_images: [],
        item_detail: []
      },
      isPullLoading: false,
      currentImgIndex: 0,

      isShowCouponModal: false,
      isShowJumpModal: false,
      isJumping: false,

      // 携带来的参数
      queryFrom: {
        isFromH5: 0,
        item_id: '',
        red_packet: '',
        coupon_amount: '',
        actual_price: '',
        item_url: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', ['accessToken']),
    isWxmp () {
      return platform.isWxmp
      // return true
    },
    hasCoupon () {
      return +this.goodsData.coupon_amount !== 0 && +this.goodsData.coupon_amount
    }
  },
  created () {
    console.log('window', window.innerWidth, window.innerHeight)
    console.log('urlParams', tools.getQueryObject())
    this.$loading.show()
    this.getQuery()
    this.getGoodsDetail()
  },
  methods: {
    onRefresh () {
      this.getGoodsDetail()
    },
    getQuery () {
      this.queryFrom = this.$route.query
      this.queryFrom.item_url = decodeURIComponent(this.queryFrom.item_url)
      if (this.queryFrom.item_url.match(/^\/\//)) {
        this.queryFrom.item_url = 'https:' + this.queryFrom.item_url
      }
    },
    getGoodsDetail () {
      // eslint-disable-next-line camelcase
      const { item_id, red_packet, coupon_amount, actual_price } = this.queryFrom
      let params = {
        item_id,
        red_packet,
        coupon_amount,
        actual_price
      }
      api.getGoodsDetail(params).then(res => {
        this.$loading.hide()
        this.isPullLoading = false
        const data = res.data

        if (data.list) {
          this.goodsData = data.list || {}

          this.goodsData.small_images = this.goodsData.small_images || []
          this.goodsData.item_detail = this.goodsData.item_detail || []
          // 图片处理
          this.goodsData.base_pic = this.handleImg(this.goodsData.base_pic)
          this.goodsData.small_images = this.goodsData.small_images.map(v => {
            return this.handleImg(v)
          })
          this.goodsData.item_detail = this.goodsData.item_detail.map(v => {
            return this.handleImg(v)
          })

          if (this.isWxmp) {
            this.postMsgToWxmp()
          }
        }
      }).catch(e => {
        console.log(e)
        this.isPullLoading = false
        this.$loading.hide()
      })
    },
    onBuy () {
      if (this.isWxmp) {
        // 小程序环境跳转原生引导下载页
        openNative.toWxmpDownload()
        return
      }
      this.onCloseCouponModal()
      this.isShowJumpModal = true
      setTimeout(() => {
        this.$nextTick(() => {
          this.isJumping = true
        })
      }, 100)
      console.log(this.queryFrom.item_url)
      setTimeout(() => {
        callNative.toTbBuy({
          itemUrl: this.queryFrom.item_url
        })
        this.isShowJumpModal = false
        this.isJumping = false
      }, 3000)
    },
    // 返回按钮
    onBack () {
      if (this.$route.query.isFromH5 + '' === '1') {
        this.$router.go(-1)
      } else {
        callNative.closeWebview()
      }
    },
    onShare () {
      const path = '/pages/Body/pages/web/web?id=' + encodeURIComponent(window.location.href)
      callNative.openShare({
        path: path,
        title: this.goodsData.item_title,
        desc: '',
        pic: this.goodsData.base_pic
      })
    },
    onSwipeChange (index) {
      this.currentImgIndex = index
    },
    onShowCouponModal () {
      this.isShowCouponModal = true
    },
    onCloseCouponModal () {
      this.isShowCouponModal = false
    },
    onCloseModal () {
      this.onCloseCouponModal()
    },
    // 传递分享数据给原生小程序（小程序特定时机才会触发webview的bindmessage获取到数据）
    postMsgToWxmp () {
      wx.miniProgram.postMessage({
        data: {
          // currentUrl取当前页完整url，仅用于小程序端判断webview当前是否处于该页面
          currentUrl: window.location.href,
          // url是真正要分享的页面url
          url: window.location.href,
          title: this.goodsData.item_title,
          imageUrl: this.goodsData.base_pic
        }
      })
    },
    // 图片处理
    handleImg (imgUrl) {
      if (imgUrl.match(/^http:/)) {
        // http替换为https
        imgUrl = 'https:' + imgUrl.split('http:')[1]
      }
      // 拼接字符串，减少体积
      imgUrl = imgUrl + '_640x0q80'
      return imgUrl
    }
  },

  components: { toTop }
}
</script>

<style lang="less" scoped>
  @import url('./goodsDetail.less');
</style>
