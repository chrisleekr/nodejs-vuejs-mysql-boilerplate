import axios from 'axios'

export default {
  passwordReset({ key, password }) {
    return axios
      .post(`${process.env.API_URL}/user/password-reset`, {
        key,
        password
      })
      .then((response) => {
        return response.data
      })
  },

  passwordResetRequest({ email }) {
    return axios
      .post(`${process.env.API_URL}/user/password-reset-request`, {
        email
      })
      .then((response) => {
        return response.data
      })
  },

  register({ username, email, password, firstName, lastName }) {
    return axios
      .post(`${process.env.API_URL}/user/register`, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })
      .then((response) => {
        return response.data
      })
  },

  login(username, password) {
    return axios
      .post(`${process.env.API_URL}/user/login`, {
        username,
        password
      })
      .then((response) => {
        return response.data
      })
      .catch((e) => {
        throw e
      })
  }
}
