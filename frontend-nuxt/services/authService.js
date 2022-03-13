export default {
  passwordReset($axios, { key, password }) {
    return $axios
      .post(`${process.env.API_URL}/user/password-reset`, {
        key,
        password
      })
      .then((response) => response.data)
  },

  passwordResetRequest($axios, { email }) {
    return $axios
      .post(`${process.env.API_URL}/user/password-reset-request`, {
        email
      })
      .then((response) => response.data)
  },

  register($axios, { username, email, password, firstName, lastName }) {
    return $axios
      .post(`${process.env.API_URL}/user/register`, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })
      .then((response) => response.data)
  },

  login($axios, { username, password }) {
    return $axios
      .post(`${process.env.API_URL}/user/login`, {
        username,
        password
      })
      .then((response) => response.data)
  }
}
