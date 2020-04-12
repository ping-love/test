<template>
  <div
    class="header-global"
    :class="{ inWebview: isInWebview }"
    v-show="isShow"
  >
    <i @click="goBack" class="leftIcon"></i>

    <span class="headTitle">{{headTitle || routerTitle}}</span>

    <div class="right" @click="onRight">
      <!-- 右侧slot插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import platform from '@@/utils/platform'
import callNative from '@@/utils/callNative'

export default {
  name: 'TopHead',

  props: {
    // 自定义标题文字
    headTitle: {
      type: String,
      default: ''
    },
    // 自定义返回按钮事件(可选)
    onBack: {
      type: Function
    },
    // 右侧点击事件(可选)
    onRight: {
      type: Function,
      default: () => {}
    },
    isInWebview: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      routerTitle: ''
    }
  },

  created () {
    this.getTitle()
  },

  computed: {
    isShow () {
      return !platform.isWxmp
    }
  },

  methods: {
    goBack () {
      if (this.onBack) {
        this.onBack()
        return
      }
      if (this.$route.name === 'Index') {
        callNative.closeWebview()
      } else {
        this.$router.go(-1)
      }
    },
    getTitle () {
      if (this.$route.meta) {
        this.routerTitle = this.$route.meta.title || '点一点'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  // header自身高度
  @height: 44px;
  // 客户端顶部状态栏预留高度
  @statusBarHeight: 26px;
  // resources下的图片路径
  @imgUrl: '~@@/assets/images/';

  .header-global {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: @height;
    line-height: @height;
    text-align: center;
    font-family: PingFangSC-Medium,PingFang SC;
    color: #2e2e2e;
    background-color: #fff;
    box-sizing: content-box;
    font-size: 16px;

    .leftIcon {
      width: 30px;
      height: @height;
      background: url('@{imgUrl}goBack.png') center no-repeat;
      background-size: 28%;
      position: absolute;
      top: 0;
      left: 0;
      padding-right: 10px;
    }

    .headTitle {
      font-size: 16px;
      letter-spacing: 1px;
      font-weight: 500;
    }

    // slot插槽父盒子
    .right {
      position: absolute;
      height: @height;
      right: 0;
      top: 0;
      padding-right: 10px;
      padding-left: 10px;
    }

    &.inWebview {
      padding-top: @statusBarHeight;
      .leftIcon {
        top: @statusBarHeight;
      }
      .right {
        top: @statusBarHeight;
      }
    }
  }
</style>

<style lang="less">
/*
 * 适配各平台头部间距
 * 配合mixins adapter
 * 无scoped，作用于全局
 */
// header自身高度
@height: 44px;
// 客户端顶部状态栏预留高度
@statusBarHeight: 26px;

.adapterTags {
  padding-top: @height + @statusBarHeight;

  &.isWxmp {
    padding-top: 0;
  }
  &.isInnerApp {
    padding-top: @height + @statusBarHeight;
  }
}
</style>
