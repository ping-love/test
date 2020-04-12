/**
* 商品楼层模块
*/
<template>
  <div class='commondityFloor'>
    <h3 style="line-height: 34px; text-align: center;">商品楼层</h3>
    <div class="bannerBox" v-if="!!itemObj.bannerPic">
      <img :src="itemObj.bannerPic" alt="">
    </div>
    <div class="commodityBox">
      <div class="itemBox" :class="{'lastItemBox': index === itemObj.itemList.length - 1}" v-for="(obj, index) in itemObj.itemList" :key="index" @click="toGoodsDetail(obj)">
        <img :src="obj.imgPic" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {}
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

  },
  methods: {
    toGoodsDetail (item) {
      console.log('-commodity-item-', item)
    }
  }
}
</script>

<style lang='less' scoped>
.bannerBox {
  img {
    width: 100%;
    display: block;
  }
}
.commodityBox {
  display: flex;
  overflow-y: auto;
  .itemBox {
    width: 100px;
    margin-right: 10px;
    img {
      // width: 100%;
      display: block;
    }
  }
  .lastItemBox {
    margin-right: 0;
  }
}
</style>
