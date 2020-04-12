/**
* 图片导航
*/
<template>
  <div class='imgNav'>
    <h3 style="line-height: 34px; text-align: center;">图片导航</h3>
    <div class="imgBox">
      <div :class="currClass" v-for="(obj, index) in itemObj.itemPics" :key="index" @click="toActivityPage(obj)">
        <img :src="obj.imgPic" alt="">
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
      }
      console.log('-className-', clsName)
      return clsName
    }
  },
  methods: {
    // 跳转活动页
    toActivityPage (item) {
      console.log('-item-data-', item, '-activityId-', item.activityId)
      this.$toast('即将前往活动页。。。')
    }
  }
}
</script>

<style lang='less' scoped>
.imgNav {
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
.imgBox {
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
