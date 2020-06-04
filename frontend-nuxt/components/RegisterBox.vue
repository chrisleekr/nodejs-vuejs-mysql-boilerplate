<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group
        id="group-email"
        label="Email address"
        label-for="input-email"
        label-cols="4"
        label-cols-lg="2"
      >
        <b-form-input
          id="input-email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email address"
          :state="
            isBrowser && $v.form.email.$dirty ? !$v.form.email.$error : null
          "
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>

        <b-form-invalid-feedback id="input-email-invalid"
          >Please enter your last name.</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group
        id="group-username"
        label="Username"
        label-for="input-username"
        label-cols="4"
        label-cols-lg="2"
      >
        <b-form-input
          id="input-username"
          v-model="form.username"
          type="text"
          required
          placeholder="Enter username"
          :state="
            isBrowser && $v.form.username.$dirty
              ? !$v.form.username.$error
              : null
          "
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>

        <b-form-invalid-feedback id="input-username-invalid"
          >Please enter your username or email address.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        id="group-password"
        label="Password"
        label-for="input-password"
        label-cols="4"
        label-cols-lg="2"
      >
        <b-form-input
          id="input-password"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter password"
          :state="
            isBrowser && $v.form.password.$dirty
              ? !$v.form.password.$error
              : null
          "
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>
        <b-form-invalid-feedback id="input-password-invalid"
          >Please enter your password.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        id="group-first-name"
        label="First name"
        label-for="input-first-name"
        label-cols="4"
        label-cols-lg="2"
      >
        <b-form-input
          id="input-first-name"
          v-model="form.firstName"
          type="text"
          required
          placeholder="Enter first name"
          :state="
            isBrowser && $v.form.firstName.$dirty
              ? !$v.form.firstName.$error
              : null
          "
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>
        <b-form-invalid-feedback id="input-first-name-invalid"
          >Please enter your first name.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        id="group-last-name"
        label="Last name"
        label-for="input-last-name"
        label-cols="4"
        label-cols-lg="2"
      >
        <b-form-input
          id="input-last-name"
          v-model="form.lastName"
          type="text"
          required
          placeholder="Enter last name"
          :state="
            isBrowser && $v.form.lastName.$dirty
              ? !$v.form.lastName.$error
              : null
          "
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>
        <b-form-invalid-feedback id="input-last-name-invalid"
          >Please enter your last name.</b-form-invalid-feedback
        >
      </b-form-group>

      <template v-if="errorMessages">
        <b-row class="mb-2">
          <b-col class="text-danger message-col">{{ errorMessages }}</b-col>
        </b-row>
      </template>

      <b-row>
        <b-col>
          <b-button
            type="submit"
            variant="primary"
            :disabled="(isBrowser && $v.form.$invalid) || loading"
          >
            <span v-if="loading" class="spinner spinner-white"></span>
            Register
          </b-button>
        </b-col>
        <b-col class="text-right">
          <b-link :to="{ path: '/login' }">Back to login</b-link>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { email, required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'RegisterBox',
  asyncData() {
    return { isBrowser: process.browser }
  },
  data() {
    return {
      isBrowser: false,
      form: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      firstName: {
        required
      },
      lastName: {
        required
      },
      username: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  computed: {
    ...mapGetters('alert', ['errorMessages']),
    ...mapState('auth', ['loading']),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  mounted() {
    this.isBrowser = process.browser
    if (this.isLoggedIn) {
      // Already logged in
      this.logout({ router: this.$router, slient: true })
    }
  },
  methods: {
    ...mapActions('auth', ['register', 'logout']),
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }

      // Form submit logic
      this.register({
        email: this.form.email,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        username: this.form.username,
        password: this.form.password,
        router: this.$router
      })
    }
  }
}
</script>
