import { cookieAuthKey } from '@/store/auth'

export default function ({ app, store }) {
  const cookieRes = app.$cookies.get(cookieAuthKey)
  store.dispatch('auth/updateAuthKey', { authKey: cookieRes })
}
