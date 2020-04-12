<template>
  <div class="index">
    <headerBar :onBack="onBack"></headerBar>

    <van-button type="info" @click="onClick">简单的页面-例如下载页</van-button>
  </div>
</template>

<script>
import headerBar from '@@/components/headerBar/headerBar'
import { mapGetters } from 'vuex'
import tools from '@@/utils/tools'
import bridge from '@@/utils/bridge'
import adapter from '@@/mixins/adapter'

export default {
  name: 'index',
  mixins: [adapter],
  data () {
    return {

    }
  },
  created () {
    console.log('window', window.innerWidth, window.innerHeight)
    console.log('urlParams', tools.getQueryObject())
    this.$loading.show()
  },
  computed: {
    ...mapGetters('user', ['userId'])
  },
  mounted () {
    setTimeout(() => {
      this.$loading.hide()
    }, 1000)
  },
  methods: {
    // 返回按钮
    onBack () {
      if (this.$route.name === 'Index') {
        // 关闭webview，去原生页
        bridge.closeWebview()
      } else {
        this.$router.go(-1)
      }
    },
    onClick () {
      this.$toast('aaa')
      this.$router.push({
        name: 'About'
      })
    }
  },
  components: {
    headerBar
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';

.index {
  height: 100%;
}
</style>
