<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group id="group-email" label="Email address" label-for="input-email" label-cols="4" label-cols-lg="2">
        <b-form-input
          id="input-email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email address"
          :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>

        <b-form-invalid-feedback id="input-email-invalid">Please enter your last name.</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="group-username" label="Username" label-for="input-username" label-cols="4" label-cols-lg="2">
        <b-form-input
          id="input-username"
          v-model="form.username"
          type="text"
          required
          placeholder="Enter username"
          :state="$v.form.username.$dirty ? !$v.form.username.$error : null"
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>

        <b-form-invalid-feedback id="input-username-invalid"
          >Please enter your username or email address.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group id="group-password" label="Password" label-for="input-password" label-cols="4" label-cols-lg="2">
        <b-form-input
          id="input-password"
          type="password"
          v-model="form.password"
          required
          placeholder="Enter password"
          :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>
        <b-form-invalid-feedback id="input-password-invalid">Please enter your password.</b-form-invalid-feedback>
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
          type="text"
          v-model="form.firstName"
          required
          placeholder="Enter first name"
          :state="$v.form.firstName.$dirty ? !$v.form.firstName.$error : null"
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>
        <b-form-invalid-feedback id="input-first-name-invalid">Please enter your first name.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="group-last-name" label="Last name" label-for="input-last-name" label-cols="4" label-cols-lg="2">
        <b-form-input
          id="input-last-name"
          type="text"
          v-model="form.lastName"
          required
          placeholder="Enter last name"
          :state="$v.form.lastName.$dirty ? !$v.form.lastName.$error : null"
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>
        <b-form-invalid-feedback id="input-last-name-invalid">Please enter your last name.</b-form-invalid-feedback>
      </b-form-group>

      <template v-if="errorMessages">
        <b-row class="mb-2">
          <b-col class="text-danger message-col">{{ errorMessages }}</b-col>
        </b-row>
      </template>

      <b-row>
        <b-col>
          <b-button type="submit" variant="primary" :disabled="$v.form.$invalid || loading">
            <span class="spinner spinner-white" v-if="loading"></span>
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
import { mapState, mapGetters, mapActions } from 'vuex';
import { email, required, minLength } from 'vuelidate/lib/validators';
import router from '@/router';

export default {
  name: 'RegisterBox',
  data() {
    return {
      form: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: ''
      }
    };
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
  mounted() {
    if (this.isLoggedIn) {
      // Already logged in
      this.logout({ router, slient: true });
    }
  },
  computed: {
    ...mapGetters('alert', ['errorMessages']),
    ...mapState('auth', ['loading']),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['register', 'logout']),
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      // Form submit logic
      this.register({
        email: this.form.email,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        username: this.form.username,
        password: this.form.password,
        router
      });
    }
  }
};
</script>
