/**
 * 一分购参与者参与活动 行为统计
 */
import api from '@/api'

export default {
  created () {
    this.getIntoTime = Math.floor(+new Date() / 1000)
    this.pvHandleEvent('add')
  },

  beforeDestroy () {
    this.pvOnSubmit('beforeDestroy')
    this.pvHandleEvent('remove')
  },

  methods: {
    pvHandleEvent (handle) {
      if (handle === 'add') {
        window.addEventListener('pagehide', this.pvOnSubmit.bind(this), false)
        window.addEventListener('beforeunload', this.pvOnSubmit.bind(this), false)
        window.addEventListener('unload', this.pvOnSubmit.bind(this), false)
      } else if (handle === 'remove') {
        window.removeEventListener('pagehide', this.pvOnSubmit, false)
        window.removeEventListener('beforeunload', this.pvOnSubmit, false)
        window.removeEventListener('unload', this.pvOnSubmit, false)
      }
    },
    pvOnSubmit () {
      if (this.pvHasSend) return
      this.pvHasSend = true

      if (!this.userId) return

      // 接口请求
      let params = {
        user_id: this.userId,
        scene_id: 1,
        get_into_time: this.getIntoTime,
        get_out_time: Math.floor(+new Date() / 1000)
      }
      api.recordVisit(params).then(res => {
        console.log('recordVisit success')
      })
    }
  }
}
