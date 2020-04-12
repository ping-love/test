export default {
  namespaced: true,

  state: {
    accessToken: '',
    userId: ''
  },

  getters: {
    accessToken (state) {
      return state.accessToken
    },
    userId (state) {
      return state.userId
    }
  },

  mutations: {
    setAccessToken (state, accessToken) {
      state.accessToken = accessToken
    },
    setUserId (state, userId) {
      state.userId = userId
    }
  },

  actions: {
  }
}
