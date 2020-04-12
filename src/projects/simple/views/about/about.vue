<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- 防抖测试 -->
    <input type="text" @input="debouncedOnChange" placeholder="防抖测试">
    <!-- 节流测试 -->
    <div>
      <button @click="onStart">节流测试：{{num}}</button>
    </div>
  </div>
</template>

<script>
import tools from '@@/utils/tools'

export default {
  data () {
    return {
      num: 0
    }
  },
  computed: {
    debouncedOnChange () {
      return tools.debounce(this.onChange, 1000)
    },
    throttledOnPlus () {
      return tools.throttle(this.onPlus, 1000)
    }
  },
  methods: {
    onChange (e) {
      console.log(e.target.value)
    },
    onStart () {
      setInterval(() => {
        this.throttledOnPlus()
      }, 10)
    },
    onPlus () {
      this.num++
    }
  }
}
</script>

<style lang="less" scoped>
.about {
  text-align: center;
  padding: 20px;
}
</style>
