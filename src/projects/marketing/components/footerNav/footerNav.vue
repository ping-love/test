/**
* 底部导航
*/
<template>
  <div class='footerNav'>
    <!-- <h3 style="line-height: 34px; text-align: center;">底部导航</h3> -->
    <div class="footerBox">
      <div class="itemBox" v-for="obj in itemObj.itemList" :key="obj.itemId" @click="toActivityPage(obj)">
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
    toActivityPage (item) {
      console.log('-footerNav-item-', item, item.itemId)
      const id = item.itemId
      this.$toast(`activityId:${id}`)
    }
  }
}
</script>

<style lang='less' scoped>
// @footerHeight: 50px;
@import '../../assets/styles/variables.less';
.footerNav {
  position: fixed;
  bottom: 0;
  margin: auto;
  z-index: 999;
  .footerBox {
    display: flex;
    justify-content: space-between;
    height: @footerHeight;
    .itemBox {
      img {
        width: auto;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
