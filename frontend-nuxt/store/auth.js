import _ from 'lodash'
import moment from 'moment'
import jwtDecode from 'jwt-decode'

import authService from '@/services/authService'

export const cookieAuthKey = 'frontend-nuxt-auth-key'
export const cookieRefreshAuthKey = 'frontend-nuxt-refresh-auth-key'

export const state = () => ({
  authKey: null,
  refreshAuthKey: null,
  loading: false,
  isRegistered: false,
  isLoggedIn: false,
  isPasswordResetRequested: false,
  isPasswordResetted: false,
  user: null
})

export const actions = {
  passwordReset({ dispatch, commit }, { key, password, router }) {
    dispatch('alert/clear', {}, { root: true })
    commit('startRequest')

    authService
      .passwordReset(this.$axios, { key, password })
      .then((response) => {
        commit('passwordResetSuccess', {})
        dispatch(
          'alert/success',
          { showType: 'toast', text: response.message },
          { root: true }
        )
      })
      .catch((e) => {
        commit('passwordResetFailure')

        dispatch('common/handleServiceException', { e, router }, { root: true })
      })
  },
  passwordResetRequest({ dispatch, commit }, { email, router }) {
    dispatch('alert/clear', {}, { root: true })
    commit('startRequest')

    authService
      .passwordResetRequest(this.$axios, { email })
      .then((response) => {
        commit('passwordResetRequestSuccess', {})
        dispatch(
          'alert/success',
          { showType: 'toast', text: response.message },
          { root: true }
        )
      })
      .catch((e) => {
        commit('passwordResetRequestFailure')

        dispatch('common/handleServiceException', { e, router }, { root: true })
      })
  },
  register(
    { dispatch, commit },
    { username, email, password, firstName, lastName, router }
  ) {
    dispatch('alert/clear', {}, { root: true })
    commit('startRequest')

    authService
      .register(this.$axios, { username, email, password, firstName, lastName })
      .then((response) => {
        commit('registerSuccess', {})
        dispatch(
          'alert/success',
          { showType: 'toast', text: response.message },
          { root: true }
        )
      })
      .catch((e) => {
        commit('registerFailure')

        dispatch('common/handleServiceException', { e, router }, { root: true })
      })
  },
  login({ dispatch, commit }, { username, password, router }) {
    dispatch('alert/clear', {}, { root: true })
    commit('startRequest')

    authService
      .login(this.$axios, { username, password })
      .then((response) => {
        const { auth_key: authKey, refresh_auth_key: refreshAuthKey } =
          response.data

        commit('loginSuccess', { authKey, refreshAuthKey })

        dispatch(
          'alert/success',
          { showType: 'toast', text: response.message },
          { root: true }
        )
        router.push('/')
      })
      .catch((e) => {
        commit('loginFailure')

        dispatch('common/handleServiceException', { e, router }, { root: true })
      })
  },
  logout({ dispatch, commit }, { router, slient = false }) {
    dispatch('alert/clear', {}, { root: true })

    commit('logout')

    if (!slient) {
      dispatch(
        'alert/success',
        { showType: 'toast', text: 'You are successfully logged out.' },
        { root: true }
      )

      router.push('/')
    }
  },
  updateAuthKey({ commit }, { authKey, refreshAuthKey }) {
    commit('setAuthKey', { authKey, refreshAuthKey })
    if (authKey) {
      commit('setUser', jwtDecode(authKey))
    }
  },
  sessionExpired({ dispatch, commit }, { router }) {
    dispatch('alert/clear', {}, { root: true })
    commit('logout')
    dispatch(
      'alert/error',
      {
        showType: 'toast',
        text: 'Session expired. Please login with your account.'
      },
      { root: true }
    )

    router.push('/login')
  },
  handleAuthMessageKey({ dispatch }, { messageKey }) {
    switch (messageKey) {
      case 'registerConfirmSuccess':
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            title: 'Success',
            text: 'You are now verified. Please use your username/password to login.'
          },
          { root: true }
        )
        break
      case 'registerConfirmFailed':
        dispatch(
          'alert/error',
          {
            showType: 'toast',
            title: 'Failed',
            text: 'Sorry, we cannot verify your email. Please try again.'
          },
          { root: true }
        )
        break
      case 'registerConfirmValidationError':
        dispatch(
          'alert/error',
          {
            showType: 'toast',
            title: 'Failed',
            text: 'The token is expired or not valid. Please try again.'
          },
          { root: true }
        )
        break
      default:
        break
    }
  }
}

export const getters = {
  isLoggedIn: (state) => () => {
    if (state.isLoggedIn) {
      return true
    }

    // Check auth key
    if (_.isEmpty(state.authKey)) {
      return false
    }

    let decoded = null
    try {
      decoded = jwtDecode(state.authKey)
    } catch (e) {
      return false
    }

    if (decoded.exp && moment.unix(decoded.exp).isAfter()) {
      return true
    }

    // Check refresh auth key
    if (_.isEmpty(state.refreshAuthKey)) {
      return false
    }

    try {
      decoded = jwtDecode(state.refreshAuthKey)
    } catch (e) {
      return false
    }

    if (decoded.exp && moment.unix(decoded.exp).isAfter()) {
      return true
    }

    return false
  }
}

export const mutations = {
  startRequest(state) {
    state.loading = true
    state.isRegistered = false
    state.isLoggedIn = false
  },
  loginSuccess(state, { authKey, refreshAuthKey }) {
    state.loading = false
    state.isLoggedIn = true
    state.authKey = authKey
    state.refreshAuthKey = refreshAuthKey
    state.user = jwtDecode(authKey)

    this.$cookies.set(cookieAuthKey, authKey)
    this.$cookies.set(cookieRefreshAuthKey, refreshAuthKey)

    localStorage.setItem(cookieAuthKey, authKey)
    localStorage.setItem(cookieRefreshAuthKey, refreshAuthKey)
  },
  loginFailure(state) {
    state.loading = false
  },
  registerSuccess(state) {
    state.loading = false
    state.isRegistered = true
  },
  registerFailure(state) {
    state.loading = false
    state.isRegistered = false
  },
  passwordResetRequestSuccess(state) {
    state.loading = false
    state.isPasswordResetRequested = true
  },
  passwordResetRequestFailure(state) {
    state.loading = false
    state.isPasswordResetRequested = false
  },
  passwordResetSuccess(state) {
    state.loading = false
    state.isPasswordResetted = true
  },
  passwordResetFailure(state) {
    state.loading = false
    state.isPasswordResetted = false
  },
  logout(state) {
    state.isLoggedIn = false
    state.authKey = null
    state.user = null
    this.$cookies.remove(cookieAuthKey)
    this.$cookies.remove(cookieRefreshAuthKey)
  },
  clear(state) {
    state.loading = false
    state.isRegistered = false
    state.isLoggedIn = false
    state.isPasswordResetRequested = false
  },
  setAuthKey(state, { authKey, refreshAuthKey }) {
    state.authKey = authKey
    state.refreshAuthKey = refreshAuthKey
  },
  setUser(state, user) {
    state.user = user
  }
}
