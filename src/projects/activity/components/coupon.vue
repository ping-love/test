<template>
  <div class="coupons" :style="{ background: couponsBgColor }">
    <ul class="coupons-box flex">
      <li
        class="flex"
        v-for="(val, idx) in list"
        :key="idx"
        :style="{
          display: idx + 1 > showNum ? 'none' : 'block',
          marginBottom:
            (list.length <= showNum && idx < list.length - 2) ||
            (list.length > showNum && idx < showNum - 2)
              ? '0.16rem'
              : '0'
        }"
      >
        <div class="coupons-main flex">
          <div class="coupons-top flex">
            <div class="coupons-price flex">
              ￥<span class="flex">{{ val.minus_price }}</span>
            </div>
            <div class="coupons-desc flex" :style="{'padding': val.isNum ? '0 0.18rem' : '0 0.36rem'}" v-if="val.full_price > 0">
              <p>满￥{{ val.full_price }}可用</p>
              <p>{{ val.coupon_name | name(9) }}</p>
            </div>
            <div class="coupons-desc flex" :style="{'padding': val.isNum ? '0 0.18rem' : '0 0.36rem'}" v-else>
              <p>任意金额可用</p>
            </div>
          </div>
          <span class="get-btn flex" @click="getCoupons(val.coupon_id)"
            >立即领取</span
          >
        </div>
      </li>
    </ul>
    <!-- <div class="more flex" @click="moreClick()" v-if="list.length > showBtn">
      <img
        class="more-btn"
        src="../assets/image/image-more.png"
        v-show="moreBtnType"
        alt=""
      />
      <img
        class="no-more-btn"
        src="../assets/image/image-packup.png"
        v-show="!moreBtnType"
        alt=""
      />
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'coupons',
  data () {
    return {
      // 查看更多按钮状态
      moreBtnType: true
    }
  },
  props: ['couponsBgColor', 'list', 'showNum', 'showBtn'],
  mounted () {
    // console.log("优惠卷组件加载完成");
  },
  methods: {
    moreClick () {
      this.moreBtnType = !this.moreBtnType
      this.moreBtnType
        ? this.$emit('refreshCoupons', 'close')
        : this.$emit('refreshCoupons', 'open')
    },
    getCoupons (id) {
      console.log('优惠卷id:', id)
      this.$emit('gainCoupons', id)
    }
  }
}
</script>

<style lang="less" scoped>
/*优惠卷组件 组件二*/
.coupons {
  width: 100%;
}
.coupons-box {
  width: 100%;
  padding: 0.08rem 0.16rem;
  flex-wrap: wrap;
  justify-content: space-between;
}
.coupons-box li {
  width: 49%;
}
.coupons-main {
  background: #ffffff;
  flex-direction: column;
  border-radius: 0.12rem;
  -webkit-border-radius: 0.12rem;
  -moz-border-radius: 0.12rem;
}
.coupons-top {
  height: 1.08rem;
  padding: 0.2rem 0;
  justify-content: center;
  align-items: center;
}
.coupons-price {
  // width: 35%;
  font-size: 0.32rem;
  font-weight: 600;
  color: #ffa30e;
  justify-content: center;
  align-items: flex-end;
  padding-right: 0.18rem;
}
.coupons-price span {
  /* height: 0.68rem; */
  font-size: 0.72rem;
  line-height: 0.66rem;
}
.coupons-desc {
  // width: 65%;
  color: #666666;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.18rem;
  padding-right: 0.10rem;
}
.coupons-desc p {
  font-size: 0.24rem;
  line-height: 0.32rem;
}
.coupons-desc p:first-child {
  padding-bottom: 0.04rem;
}
.get-btn {
  height: 0.5rem;
  background: #fdc553;
  color: #ffffff;
  font-size: 0.24rem;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 0.12rem;
  -webkit-border-radius: 0.12rem;
  -moz-border-radius: 0.12rem;
}
</style>
