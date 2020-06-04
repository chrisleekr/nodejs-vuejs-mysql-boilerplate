export const state = () => ({})

export const actions = {}

export const getters = {
  loggedInUser(state) {
    return state.auth.user
  },
  isLoggedIn(state) {
    return state.auth && state.auth.loggedIn ? state.auth.loggedIn : false
  }
}

export const mutations = {}
