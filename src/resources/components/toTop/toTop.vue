/**
 * 返回顶部 按钮
 */
<template>
  <div class="toTopBox" v-show="isShow" @click="onToTop">
    <div class="toTop">
      <i class="icon"></i>
    </div>
  </div>
</template>

<script>
import tools from '@@/utils/tools'

export default {
  props: {
    // 滚动父元素的选择器，组件内通过document.querySelector(selector)查找
    selector: {
      type: String,
      default: '.van-pull-refresh'
    }
  },

  data () {
    return {
      isShow: false
    }
  },

  computed: {
    // 函数节流
    throttledWatchScroll () {
      return tools.throttle(this.watchScroll, 100)
    }
  },

  created () {},

  mounted () {
    const ele = document.querySelector(this.selector)
    ele.addEventListener('scroll', this.throttledWatchScroll, { passive: true })
  },

  beforeDestory () {
    const ele = document.querySelector(this.selector)
    ele.removeEventListener('scroll', this.throttledWatchScroll)
  },

  methods: {
    // 往上卷曲高度为滚动父容器高度的一倍时显示按钮
    watchScroll (e) {
      this.isShow = e.target.scrollTop > e.target.offsetHeight
    },
    // 返回顶部
    onToTop () {
      const ele = document.querySelector(this.selector)
      const currentScrollTop = ele.scrollTop
      const step = 50
      let i = 1
      let timeId
      timeId = setInterval(() => {
        let position = currentScrollTop - step * i
        if (position <= 0) {
          position = 0
          clearInterval(timeId)
        }
        ele.scroll(0, position)
        i++
      }, 5)
    }
  },

  components: {}
}
</script>

<style lang='less' scoped>
@imgUrlGlobal: '~@@/assets/images/';

.toTop {
  position: fixed;
  bottom: 68px;
  right: 9px;
  z-index: 90;

  .icon {
    display: inline-block;
    width: 38px;
    height: 38px;
    background: url('@{imgUrlGlobal}toTop.png') center no-repeat;
    background-size: contain;
  }
}
</style>
