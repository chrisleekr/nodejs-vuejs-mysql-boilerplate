import { cookieAuthKey, cookieRefreshAuthKey } from '@/store/auth'

export default function ({ app, store }) {
  const authKey = app.$cookies.get(cookieAuthKey)
  const refreshAuthKey = app.$cookies.get(cookieRefreshAuthKey)
  store.dispatch('auth/updateAuthKey', { authKey, refreshAuthKey })
}
