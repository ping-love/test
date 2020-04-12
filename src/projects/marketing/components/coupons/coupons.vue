/**
* 优惠卷模块
*/
<template>
  <div class='coupons'>
    <h3 style="line-height: 34px; text-align: center;">优惠卷</h3>
    <div class="couponsBox">
      <div :class="currClass" v-for="(obj, index) in couponsList" :key="index" @click="getCoupons(obj)">
        <img :src="obj.isGet ? obj.gain_pic : obj.not_gain_pic" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {

    }
  },
  props: {
    itemObj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {

  },
  created () {

  },
  mounted () {

  },
  computed: {
    // 一行 ==> 1列, 2列, 3列, 4列
    currClass () {
      let len = this.itemObj.itemPics.length; let clsName
      switch (len) {
        case 1:
          clsName = 'oneColumn'
          break
        case 2:
          clsName = 'twoColumn'
          break
        case 3:
          clsName = 'threeColumn'
          break
        case 4:
          clsName = 'fourColumn'
          break
        case 5:
          clsName = 'fiveColumn'
          break
      }
      console.log('-className-', clsName)
      return clsName
    },
    couponsList () {
      return this.itemObj.itemPics
    }
  },
  methods: {
    getCoupons (item) {
      console.log('-coupons-item-data-', item.isGet)
      if (item.isGet) {
        this.$toast('优惠卷已领取')
        return
      }
      setTimeout(() => {
        this.$toast('优惠卷领取成功')
        item.isGet = true // 注意此处需要优化
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.coupons {
  padding: 0 5px;
}
.oneColumn {
  width: 365px;
}
.twoColumn {
  width: 180px;
}
.threeColumn {
  width: 118px;
}
.fourColumn {
  width: 88px;
}
.fiveColumn {
  width: 60px;
}
.couponsBox {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
