export default {
  me($axios) {
    return $axios
      .get(`${process.env.API_URL}/me`, {})
      .then((response) => response.data)
  },
  updateMe($axios, me) {
    return $axios
      .post(`${process.env.API_URL}/me`, me)
      .then((response) => response.data)
  }
}
