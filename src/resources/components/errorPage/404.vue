/**
 * 公共404页面
 */
<template>
  <div class='pageNotFound'>
    页面不翼而飞了~
    <div class="back">
      <button @click="goIndex">去首页</button>
    </div>
    <div class="urlWrap">
      {{url}}
    </div>
  </div>
</template>

<script>
export default {
  props: {},

  data () {
    return {
      url: ''
    }
  },

  computed: {},

  created () {
    this.getUrl()
  },

  methods: {
    goIndex () {
      this.$router.push('/')
    },
    getUrl () {
      this.url = window.location.href
    }
  },

  components: {}
}
</script>

<style lang='less' scoped>
.pageNotFound {
  text-align: center;
  padding-top: 120px;
}
.back {
  padding: 20px;

  button {
    background-color: #fff;
    padding: 5px 35px;
    border-radius: 5px;
  }
}
.urlWrap {
  padding: 400px 15px 0;
}
</style>
