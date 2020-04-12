/**
* 主题模块
*/
<template>
  <div class='themeModule'>
    <h3 style="line-height: 34px; text-align: center;">主题模块</h3>
    <img :src="itemObj.itemPics[0].imgPic" alt="">
    <!-- <img :src="itemObj.itemPic" v-lazy="itemObj.itemPic" :key="itemObj.itemPic" alt=""> -->
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

  }
}
</script>

<style lang='less' scoped>
.themeModule {
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
