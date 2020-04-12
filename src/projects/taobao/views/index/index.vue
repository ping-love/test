<template>
  <div class="index">
    <headerBar :onRight="onHelpIcon">
      <i class="iconHelp"></i>
    </headerBar>

    <!-- <van-pull-refresh v-model="isPullLoading" @refresh="onRefresh" :head-height="80"> -->
    <div class="content">
      <!-- 搜索框 -->
      <div class="searchBox" @click="toSearch">
        <div class="searchBar">
          复制商品标题 领券得红包获战力
        </div>
      </div>

      <!-- 搜索引导图片 -->
      <div class="introduce">
        <img src="../../assets/images/searchInfo.png" alt="">
      </div>

      <!-- tab栏 -->
      <div class="goodsBox">
        <van-tabs
          @click="onTabsClick"
          type="line"
          :swipe-threshold="4"
          color="#FDC553"
          :line-width="40 / remBase + 'rem'"
          title-active-color="#000"
          title-inactive-color="#666"
          background="#fff"
          :offset-top="offsetTop"
          sticky
          :class="{ hideTab: tabList.length <= 1 }"
          v-model="activeId"
          :ellipsis="false"
          :border="false"
        >
          <van-tab
            v-for="item in tabList"
            :key="item.favorites_id"
            :title="item.favorites_title"
            :name="item.favorites_id"
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
              v-show="item.favorites_id === activeId"
            >
              <div class="goodsItem" v-for="obj in goodsList" :key="obj.item_id" @click="toGoodsDetail(obj)">
                <div class="imgWrap">
                  <img alt="" v-lazy="obj.base_pic" :key="obj.base_pic">
                  <div class="fightTag">
                    <div class="fightTxt">{{obj.combat_effectiveness}}</div>
                  </div>
                  <!-- <div class="sellOut" v-if="+obj.stock <= 0">
                    <div class="sellOutTxt">已售罄</div>
                  </div> -->
                </div>
                <!-- 标题 -->
                <div class="titleWrap">
                  <p class="title two-txt-cut">{{obj.item_name}}</p>
                </div>
                <!-- 标签 -->
                <div class="tagWrap">
                  <div class="couponTag">
                    <p v-if="+obj.coupon_amount!==0 && +obj.coupon_amount">
                      <span>{{obj.coupon_amount}}元优惠券</span>
                    </p>
                  </div>
                  <div class="redBagTag">
                    <span>点一点送红包{{obj.red_packet}}元</span>
                  </div>
                </div>
                <!-- 价格 -->
                <div class="price">
                  <!-- <p class="taobaoPrice">
                    <span v-if="+obj.coupon_amount!==0">￥{{obj.consult_price}}淘宝参考价</span>
                  </p> -->
                  <p class="newPrice">
                    <span class="yuan">￥</span>
                    <span class="actualPrice">{{obj.actual_price}}</span>
                    <!-- <span class="txtTag"></span> -->
                    <span class="linePrice">￥{{obj.consult_price}}</span>
                  </p>
                </div>
              </div>
            </van-list>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
import headerBar from '@@/components/headerBar/headerBar'
import tools from '@@/utils/tools'
import callNative from '@@/utils/callNative'
import adapter from '@@/mixins/adapter'
import api from '@/api/index'
import platform from '@@/utils/platform'
import openNative from '@@/utils/openNative'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  mixins: [adapter],
  data () {
    return {
      isPullLoading: false,

      activeId: '', // 激活的当前tab项id
      tabList: [], // tab数据
      offsetTop: 0,
      goodsList: [], // 当前tab下的商品数据
      pageNo: 1, // 页码
      pageSize: 20, // 每页条数
      isMoreLoading: false, // 加载更多状态
      isMoreFinished: false, // 加载完全状态
      isMoreError: false, // 加载错误状态

      remBase: 37.5
    }
  },
  created () {
    console.log('window', window.innerWidth, window.innerHeight)
    console.log('urlParams', tools.getQueryObject())
    this.$loading.show()
    this.getTabsList()
  },
  computed: {
    ...mapGetters('user', ['accessToken'])
  },
  mounted () {
    setTimeout(() => {
      this.setOffsetTop()
      this.setTabsConHeight()
    }, 100)
  },
  methods: {
    // 初始化数据
    onRefresh () {
      this.getTabsList()
    },
    // 获取首页数据
    getTabsList () {
      api.getTabsList().then(res => {
        this.$loading.hide()
        this.isPullLoading = false
        const data = res.data

        if (data.list) {
          this.tabList = data.list
          if (this.tabList.length > 0) {
            this.activeId = this.tabList[0].favorites_id
          }
          this.getTabGoodsList(true)
          this.setTabsConHeight()
        }
      })
    },
    // 加载更多商品
    getTabGoodsList (isInit) {
      if (isInit) {
        this.pageNo = 1
        this.goodsList = []
        this.isMoreLoading = true
        this.isMoreFinished = false
      } else {
        this.pageNo++
      }
      const params = {
        favorites_id: this.activeId,
        page_no: this.pageNo,
        page_size: this.pageSize
      }
      api.getGoodsList(params).then(res => {
        const data = res.data

        if (!data.list || data.list.length === 0) {
          this.isMoreFinished = true
        } else {
          if (isInit) {
            this.goodsList = data.list
          } else {
            this.goodsList = [
              ...this.goodsList,
              ...data.list
            ]
          }
        }
        this.isMoreLoading = false
      }).catch(err => {
        console.log(err)
        this.isMoreError = true
      })
    },
    // 切换tab栏
    onTabsClick (name, title) {
      this.getTabGoodsList(true)
    },
    // 跳转原生搜索页
    toSearch () {
      openNative.toSearchIndex()
    },
    // 跳转商品详情页
    toGoodsDetail (item) {
      // if (+item.stock <= 0) {
      //   this.$toast('该商品已售罄')
      //   return
      // }
      callNative.openTbGoodsDetail({
        accessToken: this.accessToken,
        itemId: item.item_id,
        redPacket: item.red_packet,
        couponAmount: item.coupon_amount,
        actualPrice: item.actual_price,
        itemUrl: item.item_url
      })
    },
    // 设置tab商品列表最低高度（方便切换tab栏时维持页面浏览位置）
    setTabsConHeight () {
      if (this.tabList.length <= 1) {
        return
      }
      this.$nextTick(() => {
        // const contentEle = document.querySelector('.van-pull-refresh')
        const contentEle = document.querySelector('.content')
        const tabsContentEle = document.querySelector('.van-tabs__content')
        const tabbarEle = document.querySelector('.van-tabs__wrap')
        const tabsHeight = tabbarEle.offsetHeight
        tabsContentEle.style.minHeight = contentEle.offsetHeight - tabsHeight + 'px'
      })
    },
    // 根据运行平台设置tab栏sticky距离顶部高度
    setOffsetTop () {
      this.$nextTick(() => {
        if (platform.isWxmp) {
          this.offsetTop = 0
        } else {
          const headerEle = document.querySelector('.header-global')
          this.offsetTop = headerEle.offsetHeight - 1
        }
      })
    },
    // 点击帮助icon
    onHelpIcon () {
      console.log('跳转返利常见问题页')
      openNative.toQuestionDetail()
    }
  },
  components: {
    headerBar
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';
@imgUrlGlobal: '~@@/assets/images/';

.index {
  height: 100%;

  .content {
    height: 100%;
    overflow: auto;
  }
}
.van-pull-refresh {
  height: 100%;
  overflow: auto;

  /deep/ .van-pull-refresh__track {
    min-height: 100%;
  }
}

.searchBox {
  padding: 8px 8px 0 8px;
  background-color: #fff;

  .searchBar {
    padding: 8px 38px;
    border-radius: 20px;
    color: #666;
    font-size: 12px;
    background: #F2F2F2 url('@{imgUrlGlobal}searchIcon.png') 14px center no-repeat;
    background-size: 16px 16px;
  }
}

.introduce {
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    display: block;
  }
}

.goodsBox {
  .van-tabs {
    /deep/ .van-tabs__wrap {
      height: 26px;
      padding-top: 1px;
      background-color: #fff;
    }
    /deep/ .van-tabs__nav--line {
      .van-tab {
        line-height: inherit;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 1px;
          background-color: #E6E6E6;
          top: 2px;
          right: 0;
          height: 14px;
        }
        span {
          font-size: 14px;
          padding-right: 14px;
          padding-left: 6px;
          display: inline-block;
          // width: 100%;
        }
        &:first-of-type span {
          padding-left: 4px;
        }
        &.van-tab--active span {
          font-weight: 500;
        }
      }
      > div:nth-last-of-type(2) {
        &:after {
          display: none;
        }

        span {
          padding-right: 4px;
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
      // padding: 14px;

      img {
        width: 100%;
        height: 100%;
      }
      .fightTag {
        position: absolute;
        top: 0;
        right: 6px;
        width: 36px;
        height: 47px;
        background: url('@{imgUrl}fightIcon.png') center no-repeat;
        background-size: 100% 100%;
        text-align: center;
        padding-top: 21px;

        .fightTxt {
          font-size: 12px;
          padding: 3px 9px;
          font-family:DIN-Medium,DIN;
          font-weight:500;
          color:rgba(93,40,6,1);
        }
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
      height: 44px;
      overflow: hidden;
      padding: 4px 8px;
      font-size: 12px;
      font-family: PingFangSC-Regular,PingFang SC;
      color: #333;
      line-height: 17px;
    }
    .tagWrap {
      padding: 0 8px;

      .couponTag {
        height: 21px;

        p {
          display: inline-block;
          background: url('@{imgUrl}couponTagL.png') left center no-repeat,
            url('@{imgUrl}couponTagR.png') right center no-repeat;
          background-size: contain, contain;
          transform: scale(10/12);
          transform-origin: left top;
          padding: 0 7px;
        }
        span {
          font-size: 12px;
          color: #FF524A;
          border-top: 1px solid #FF524A;
          border-bottom: 1px solid #FF524A;
          // border-radius: 5px;
          display: inline-block;
          padding: 3px 0;
          opacity: .8;
        }
      }
      .redBagTag {
        padding-top: 2px;
        padding-bottom: 6px;
        font-weight:500;

        span {
          background-color: #FFD47B;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 12px;
          color: #333;
          transform: scale(10/12);
          transform-origin: left top;
          display: inline-block;
        }
      }
    }
    .price {
      padding: 0 8px;

      .taobaoPrice {
        color: #FF5400;
        font-size: 12px;
        font-family:PingFangSC-Regular,PingFang SC;
        height: 13px;
      }
      .newPrice {
        display: flex;
        padding: 4px 0 4px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        align-items: flex-end;

        .yuan {
          font-size: 12px;
        }
        .actualPrice {
          font-size: 16px;
          color: #000;
        }
        .txtTag {
          width: 48px;
          height: 18px;
          background: url('@{imgUrl}gotPrice.png') 2px center no-repeat;
          background-size: contain;
        }
        .linePrice {
          font-size: 12px;
          font-family: PingFangSC-Regular,PingFang SC;
          color: rgba(153,153,153,1);
          text-decoration: line-through;
          margin-left: 3px;
        }
      }
    }
  }
}

.iconHelp {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url('@{imgUrlGlobal}iconQuestion.png') center no-repeat;
  background-size: contain;
  vertical-align: middle;
}
</style>
