import axios from 'axios'

export default {
  list({ state = undefined } = {}) {
    let url = `${process.env.API_URL}/todo`
    if (state) {
      url += `/${state}`
    }

    return axios.get(url, {}).then((response) => {
      return response.data
    })
  },

  postOne({ todo }) {
    return axios
      .post(`${process.env.API_URL}/todo`, todo)
      .then((response) => {
        return response.data
      })
      .catch((e) => {
        throw e
      })
  },

  postBulk({ state, todoList }) {
    return axios
      .post(`${process.env.API_URL}/todo/${state}`, {
        todo: todoList
      })
      .then((response) => {
        return response.data
      })
  },

  deleteOne({ todoId }) {
    return axios
      .delete(`${process.env.API_URL}/todo/${todoId}`)
      .then((response) => {
        return response.data
      })
  }
}
