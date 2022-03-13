export default {
  list($axios, { state = undefined } = {}) {
    let url = `${process.env.API_URL}/todo`
    if (state) {
      url += `/${state}`
    }

    return $axios.get(url, {}).then((response) => response.data)
  },

  postOne($axios, { todo }) {
    return $axios
      .post(`${process.env.API_URL}/todo`, todo)
      .then((response) => response.data)
  },

  postBulk($axios, { state, todoList }) {
    return $axios
      .post(`${process.env.API_URL}/todo/${state}`, {
        todo: todoList
      })
      .then((response) => response.data)
  },

  deleteOne($axios, { todoId }) {
    return $axios
      .delete(`${process.env.API_URL}/todo/${todoId}`)
      .then((response) => response.data)
  }
}
