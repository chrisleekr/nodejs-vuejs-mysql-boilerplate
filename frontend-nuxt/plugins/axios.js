import { cookieAuthKey, cookieRefreshAuthKey } from '~/store/auth'

export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    const token = localStorage.getItem(cookieAuthKey) || ''
    if (token) {
      config.headers.Authorization = token
    }
    return config
  })

  $axios.onResponseError(async (err) => {
    const originalConfig = err.config
    if (
      originalConfig.url !== `${process.env.API_URL}/use/login` &&
      err.response
    ) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          const response = await $axios.post(
            `${process.env.API_URL}/refresh-token`,
            {
              refreshToken: localStorage.getItem(cookieRefreshAuthKey) || ''
            }
          )
          const { data } = response.data

          originalConfig.headers.Authorization = data.auth_key

          store.commit('auth/loginSuccess', {
            authKey: data.auth_key,
            refreshAuthKey: data.refresh_auth_key
          })

          return Promise.resolve($axios(originalConfig))
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }
    return Promise.reject(err)
  })
}
