<template>
  <div class="index">
    <!-- <headerBar :onBack="onBack"></headerBar> -->

    <div class="content">
      <div class="headWrap">
        <div class="headUserWrap">
          <img :src="userIcon" alt="" class="hearUser">
          <p class="userName">{{nickName}}</p>
        </div>
        <div class="togetherWrap">
          <i class="together"></i>
        </div>
        <div class="headDydWrap">
          <i class="headDyd"></i>
          <p class="dydName">点一点购物</p>
        </div>
      </div>

      <div class="tipWrap">
        <p class="tipTitle">允许点一点购物进行以下操作</p>
        <p class="tipTxt">·使用你的公开信息（昵称、头像等）</p>
      </div>

      <div class="btnWrap">
        <button @click="onConfirm">确认</button>
      </div>

      <div class="bottomWrap">
        <p class="bottomTxt">
          授权后表示您已同意
          <span class="oauthProtocol" @click="toOauthProtocol">《授权协议》</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// import headerBar from '@@/components/headerBar/headerBar'
import tools from '@@/utils/tools'
import callNative from '@@/utils/callNative'
import adapter from '@@/mixins/adapter'
// import platform from '@@/utils/platform'

export default {
  name: 'index',
  mixins: [adapter],
  data () {
    return {
      userIcon: '',
      nickName: '',
      result: '', // 值为1表示授权成功，否则失败
      msg: '' // 授权失败时的提示内容
    }
  },
  created () {
    console.log('window', window.innerWidth, window.innerHeight)
    console.log('urlParams', tools.getQueryObject())
    this.$loading.show()
    this.getQuery()
  },
  mounted () {
    // this.changeTitle()
  },
  computed: {
  },
  methods: {
    getQuery () {
      const query = tools.getQueryObject()
      this.userIcon = query.userIcon
      this.nickName = query.nickName
      this.result = query.result
      this.msg = query.msg
      this.$loading.hide()
    },
    toOauthProtocol () {
      window.location.href = 'https://oauth.taobao.com/authorization-notice.html'
    },
    onConfirm () {
      const that = this
      if (this.result === '1') {
        this.$toast({
          type: 'success',
          message: '授权成功',
          duration: 3000,
          onClose () { // 轻提示关闭后的回调
            that.closeCurrent()
          }
        })
      } else {
        this.$toast({
          type: 'fail',
          message: this.msg,
          duration: 3000,
          onClose () {
            that.closeCurrent()
          }
        })
      }
    },
    // 返回按钮
    onBack () {
      this.closeCurrent()
    },
    closeCurrent () {
      console.log('关闭当前webview', window.Baichuan)
      console.log('useragent', window.navigator.userAgent)
      // callNative.closeWebview()
      // if (platform.isIos) {
      //   console.log(111)
      //   callNative.closeWebview()
      // } else {
      window.Baichuan.closeWebView((brand, model) => {
        console.log(brand, model)
      })
      // }
    },
    changeTitle () {
      this.$nextTick(() => {
        console.log('已设置导航栏标题')
        callNative.setHeaderTitle({
          title: '授权成功'
        })
      })
    }
  },
  components: {
    // headerBar
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images/';
@imgUrlGlobal: '~@@/assets/images/';

.index {
  height: 100%;
  background-color: #fff;

  .content {
    height: 100%;
    overflow: auto;
  }
}

.headWrap {
  padding: 80px 37px 58px;
  display: flex;
  justify-content: space-around;
  text-align: center;

  .headUserWrap,
  .togetherWrap,
  .headDydWrap {
    // flex: 1;
  }

  .hearUser, .headDyd {
    width:60px;
    height:60px;
    border-radius:8px;
    margin-bottom: 10px;
    overflow: hidden;
    display: inline-block;
  }
  .userName, .dydName {
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(102,102,102,1);
  }
  .userName {
    max-width: 120px;
    word-break: break-all;
  }
  .headDyd {
    background: url('@{imgUrlGlobal}logo.png') center no-repeat;
    background-size: 100% 100%;
  }
  .togetherWrap {
    padding-top: 21px;
  }
  .together {
    background: url('@{imgUrl}together.png') center no-repeat;
    width: 31px;
    height: 17px;
    background-size: 100% 100%;
  }
}

.tipWrap {
  padding: 0 20px 80px;

  .tipTitle {
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(51,51,51,1);
    padding-bottom: 15px;
  }
  .tipTxt {
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(153,153,153,1);
  }
}

.btnWrap {
  padding: 0 20px;

  button {
    width: 100%;
    background-color: #FFC554;
    padding: 12px 0;
    text-align: center;
    font-size:16px;
    font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    color:rgba(0,0,0,1);
    border-radius: 100px;
  }
}

.bottomWrap {
  padding: 15px 20px;

  .bottomTxt {
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(51,51,51,1);

    .oauthProtocol {
      color: #4A90E2;
    }
  }
}
</style>
