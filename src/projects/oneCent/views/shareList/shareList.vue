/** * 分享进程 */
<template>
  <div class="shareList">
    <header-bar></header-bar>
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
      <template v-if="!isNoData">
        <van-list
            class="shareListBox"
            v-model="loading"
            :finished="isAllFinished"
            finished-text="没有更多了"
            error.sync="isShowError"
            @load="getShareList"
            :immediate-check="false"
        >
          <van-cell v-for="(item, idx) in shareList" :key="idx">
            <!--
                    1:未支付 2:分享进行中 3:分享完成 4:分享失败 5:已取消
                  -->
            <div class="item">
              <div class="topWrap">
                <div class="itemStatus">
                  <p class="underWay" v-if="item.order_status == '1'">待付款</p>
                  <p class="underWay" v-else-if="item.order_status == '2'">分享进行中</p>
                  <p class="success" v-else-if="item.order_status == '3'">分享成功</p>
                  <p class="cancel" v-else-if="item.order_status == '4'">分享失败</p>
                  <p class="cancel" v-else>已取消</p>
                </div>

                <!-- <div class="countDown" v-if="item.isShowTime">
                      <van-count-down :time="item.count_down" @finish="onFinished(item.order_id,idx)">
                        <template v-slot="timeData">
                          <span class="timeItem">{{ timeData.hours >= 10 ? timeData.hours : `0${timeData.hours}` }}</span>
                          <span class="timeItem">{{ timeData.minutes >= 10 ? timeData.minutes : `0${timeData.minutes}` }}</span>
                          <span class="timeItem">{{ timeData.seconds >= 10 ? timeData.seconds : `0${timeData.seconds}` }}</span>
                        </template>
                      </van-count-down>
                    </div> -->

                <div
                  class="countDown"
                  v-if="
                    item.count_down && item.count_down > 0 && (item.order_status == '1' || item.order_status == '2')
                  "
                >
                  <p class="text">倒计时</p>
                  <van-count-down :time="item.count_down" @finish="onFinished(item.order_id, idx)">
                    <template v-slot="timeData">
                      <span class="timeItem">{{ timeData.hours >= 10 ? timeData.hours : `0${timeData.hours}` }}</span
                      >:
                      <span class="timeItem">{{
                        timeData.minutes >= 10 ? timeData.minutes : `0${timeData.minutes}`
                      }}</span
                      >:
                      <span class="timeItem">{{
                        timeData.seconds >= 10 ? timeData.seconds : `0${timeData.seconds}`
                      }}</span>
                    </template>
                  </van-count-down>
                </div>
              </div>
              <div class="bottomWrap">
                <van-image
                  class="itemImg"
                  width="80"
                  height="80"
                  :src="item.small_pic"
                  alt=""
                  v-lazy="item.small_pic"
                />
                <div class="itemText">
                  <p class="two-txt-cut">{{ item.item_name }}</p>
                  <!-- left_need_share_num == '0' -->
                  <p v-if="item.left_need_share_num">
                    剩余待分享 <span class="shareNum">{{ item.left_need_share_num }}</span
                    >人
                  </p>
                </div>
                <van-button
                  class="itemBtn"
                  type="info"
                  size="small"
                  v-if="item.order_status == '1'"
                  @click="itemBtnClick(item)"
                >去付款</van-button>
                <van-button
                  class="itemBtn"
                  type="info"
                  size="small"
                  v-if="item.order_status == '2'"
                  @click="itemBtnClick(item)"
                >继续分享</van-button>
                <van-button
                  class="itemBtn waitBtn"
                  type="info"
                  size="small"
                  v-if="item.order_status == '3' && item.order_item_id == '0'"
                >等待发货</van-button>
                <van-button
                  class="itemBtn"
                  type="info"
                  size="small"
                  v-if="item.order_status == '3' && item.order_item_id != '0'"
                  @click="itemBtnClick(item)"
                >查看订单</van-button>
              </div>
            </div>
          </van-cell>
        </van-list>
      </template>

      <!-- 没有数据 -->
      <template v-else>
        <div class="noData">
          <div class="msg">
            <p>您当前尚未参与活动</p>
          </div>
        </div>
      </template>
    </van-pull-refresh>
  </div>
</template>

<script>
import headerBar from '@@/components/headerBar/headerBar'
import api from '@/api/index'
import openNative from '@@/utils/openNative'
import adapter from '@@/mixins/adapter'

export default {
  name: 'ShareList',
  props: {},
  mixins: [adapter],
  data () {
    return {
      isNoData: false, // 是否没有数据
      loading: false, // 加载状态
      isAllFinished: false, // 全部加载完成
      isRefresh: false, // 是否刷新
      currTime: 0, // 当前时间
      shareList: [],
      nextFirstRow: 0,
      pageSize: 20,
      isShowError: false // 加载错误
    }
  },
  components: { headerBar },
  computed: {},

  created () {
    this.$loading.show()
    this.getShareList()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    onRefresh () {
      this.nextFirstRow = 0
      // this.shareList = []
      this.getShareList(true)
    },
    itemBtnClick (item) {
      console.log('item:', item)
      switch (item.order_status) {
        case '1':
          // TODO 状态不会改变，
          console.log('待付款-去支付-order_id:', item.order_id)
          openNative.toPayPage({ orderId: item.order_id })
          break
        case '2':
          console.log('继续分享-order_id:', item.order_id)
          // TDAPP.onEvent('penny_process_share') // 数据埋点
          openNative.toOneCentShareDetail({ orderId: item.order_id })
          break
        case '3':
          console.log('查看订单-order_item_id:', item.order_item_id) // 订单详情
          openNative.toOrderDetail({ orderItemId: item.order_item_id, orderStatus: 1 })
          break
      }
    },
    // 倒计时结束
    onFinished (orderId, idx) {
      console.log(orderId, idx)
      this.$toast('倒计时结束')
      this.onRefresh()
    },
    setItemDatas (list) {
      let midArr = []
      list.map((val, idx) => {
        let mid = {}

        mid = { ...val }
        // 支付倒计时
        if (val.left_pay_time) mid.count_down = val.left_pay_time * 1000
        // 分享倒计时
        if (val.share_end_time) mid.count_down = (val.share_end_time - this.currTime) * 1000

        midArr.push(mid)
      })
      return midArr
    },
    // 获取分享列表
    getShareList (isFresh) {
      const param = {
        first_row: this.nextFirstRow,
        fetch_num: this.pageSize
      }
      // console.log(param)
      api.getShareList(param).then(res => {
        console.log('share-list:', res)
        this.isRefresh = false // 是否加载完成
        this.$loading.hide() // 隐藏加载动画
        let data = res.data
        this.currTime = data.current_time
        // data.item_list = [
        //   {
        //     'order_status': '3',
        //     'order_id': '373',
        //     'item_id': '122',
        //     'item_name': '小灵精0001铅笔刀2个',
        //     'small_pic': 'http://img.51k1k.com/Uploads/image/default/2019-01/20190129140139_13685_750_750.png',
        //     'addtime': '1575512636',
        //     'left_pay_time': '10',
        //     'order_item_id': '890'
        //   },
        //   {
        //     'order_status': '3',
        //     'order_id': '372',
        //     'item_id': '122',
        //     'item_name': '小灵精0001铅笔刀2个',
        //     'small_pic': 'http://img.51k1k.com/Uploads/image/default/2019-01/20190129140139_13685_750_750.png',
        //     'addtime': '1575510793',
        //     'share_end_time': '15755114',
        //     'left_need_share_num': '1',
        //     'order_item_id': '0'
        //   }
        // ]
        if (!data.item_list || data.item_list.length === 0) {
          if (!this.nextFirstRow) {
            this.isNoData = true
          }
          this.loading = false
          this.isAllFinished = true
          return
        } else {
          if (this.nextFirstRow) {
            this.isNoData = false
          }
        }
        let list = this.setItemDatas(data.item_list)
        if (isFresh) {
          this.shareList = list
        } else {
          this.shareList = [...this.shareList, ...list]
        }
        // console.log(this.shareList)
        // 加载状态结束
        this.loading = false
        this.nextFirstRow = data.next_first_row // 下一页数据
        // console.log('next-first-row:', this.nextFirstRow)
        // 全部加载完成
        if (this.nextFirstRow >= data.total_num) {
          console.log('complete all loading')
          this.isAllFinished = true
        }
      }).catch(err => {
        console.log(err)
        this.isShowError = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';
.shareList {
  height: 100%;
  background: #f2f2f2;
  .shareListBox {
      .item {
        position: relative;
      }
    }
}

.topWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  line-height: 36px;
  font-size: 12px;
  color: #333333;
  .itemStatus {
    .underWay {
      color: #ffa30e;
    }
    .success {
      color: #56b700;
    }
    .cancel {
      color: #999999;
    }
  }
  .countDown {
    display: flex;
    align-items: center;
    p {
      padding-right: 2px;
    }
    .van-count-down {
      font-size: 12px;
      display: flex;
      align-items: center;

      .timeItem {
        display: block;
        width: 19px;
        height: 19px;
        color: #fff;
        text-align: center;
        background-color: #333333;
        border-radius: 4px;
        margin: 0 3px;
      }
    }
  }
}

.bottomWrap {
  display: flex;
  border-top: 1px solid #d8d8d8;
  padding-top: 8px;
  .itemImg {
    display: block;
    width: 80px;
    height: 80px;
  }
  .itemText {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 8px;
    .shareNum {
      color: #fd2a32;
    }
  }
  .van-button--small {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    min-width: 58px;
    height: 24px;
    line-height: 24px;
    color: #333;
    font-size: 12px;
    padding: 0;
    background-color: #fdc553;
    border: none;
    &.waitBtn {
      background: #F2F2F2;
      color: #666;
    }
  }
}

.noData {
  width: 240px;
  height: 240px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url('@{imgUrl}activityDone.png') no-repeat center center;
  background-size: cover;
  // .msg {
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   font-size: 12px;
  //   line-height: 18px;
  //   text-align: center;
  //   h4 {
  //     color: #666;
  //   }
  //   p{
  //     color: #999;
  //   }
  // }
  .msg {
    position: absolute;
    width: 100%;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    p{
      color: #999;
      padding-bottom: 10px;
    }
  }

}

.van-pull-refresh {
  height: 100%;
  overflow: auto;

  /deep/ .van-pull-refresh__track {
    height: 100%;
  }
}

.van-list {
  padding: 8px 8px;
}
/deep/ .van-cell {
  background: #fff;
  padding: 0 8px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 17px;
}
.van-cell:not(:last-child)::after {
  border-bottom: 0;
}
</style>
