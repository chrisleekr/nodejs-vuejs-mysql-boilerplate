import axios from 'axios'

export default {
  me() {
    return axios.get(`${process.env.API_URL}/me`, {}).then((response) => {
      return response.data
    })
  },
  updateMe(me) {
    return axios.post(`${process.env.API_URL}/me`, me).then((response) => {
      return response.data
    })
  }
}
