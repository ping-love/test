/**
 * 全屏loading效果
 */
<template>
  <transition name="loading-transition">
    <div class='loading-global' v-show="isShow">
      <div class="loading-content">
        <!-- 文字 -->
        <div class="loading-text">{{text}}</div>
        <!-- 图形 -->
        <div class="loading-icon">
          <img src="@@/assets/images/loading.gif" alt="">
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },

  data () {
    return {}
  },

  computed: {},

  created () {},

  methods: {},

  components: {}
}
</script>

<style lang='less' scoped>
.loading-global {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity .3s linear;
  background-color: #fff;

  .loading-icon {
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .loading-text {
    text-align: center;
    padding-bottom: 15px;
    font-size: 14px;
    color: #333;
  }
}

.loading-transition-enter {
  opacity: 1;
}
.loading-transition-leave-active {
  opacity: 0;
}

@keyframes svg-circular {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}
</style>
