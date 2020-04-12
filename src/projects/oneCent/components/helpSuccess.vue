/**
 * 助力成功弹窗
 */
<template>
  <div class='helpSuccess'>
    <van-popup v-model="show">
      <div class="modalWrap">
        <div class="content">
          <p class="money">
            获得
            <span>{{gotAmount}}</span>
            元红包
          </p>
          <div class="btn" @click="toGame"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import openNative from '@@/utils/openNative'
import api from '@/api/index'

export default {
  props: {
    // v-model传递
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      gotAmount: ''
    }
  },

  computed: {
    ...mapGetters('user', ['userId']),
    show: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },

  created () {
    if (this.value) {
      this.getGotAmountData()
    }
  },

  watch: {
    value (val) {
      if (this.value) {
        this.getGotAmountData()
      }
    }
  },

  methods: {
    onClose () {
      this.show = false
    },
    toGame () {
      TDAPP.onEvent('1分购成功页提现按钮点击', 'penny_success_click')
      openNative.toGameManor()
    },
    // 获取助力成功弹窗的金额
    getGotAmountData () {
      api.getGotAmount().then(res => {
        const data = res.data
        if (data.list) {
          this.gotAmount = data.list.money_amount
        }
      })
    }
  },

  components: {}
}
</script>

<style lang='less' scoped>
@imgUrl: '~@/assets/images/';

.van-popup {
  background-color: rgba(0, 0, 0, 0);
}

.modalWrap {
  background: url('@{imgUrl}helpSuccessBg.png') center no-repeat;
  width: 374px;
  height: 436px;
  margin: 0 auto;
  background-size: contain;
  text-align: center;
  position: relative;

  .content {
    position: absolute;
    top: 267px;
    width: 100%;
    left: 0;

    .money {
      font-size: 18px;
      color: #FFE261;
      padding-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 32px;
        color: #fff;
        display: inline-block;
        padding-bottom: 10px;
      }
    }
    .btn {
      width: 176px;
      height: 32px;
      background: url('@{imgUrl}helpSuccessBtn.png') center no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
    }
  }
}
</style>
