<template>
  <b-form @submit.stop.prevent="onSubmit" class="login-box" data-cy="login-form">
    <b-form-group id="group-username" label label-for="input-username" class="mb-2">
      <b-form-input
        id="input-username"
        v-model="form.username"
        type="text"
        required
        placeholder="Enter username"
        :state="$v.form.username.$dirty ? !$v.form.username.$error : null"
        data-cy="login-username"
        class="from-input input-username"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>

      <b-form-invalid-feedback
        id="input-username-invalid"
        data-cy="login-username-invalid"
        class="invalid-feedback invalid-feedback-username"
      >
        Please enter your username or email address.
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group id="group-password" label label-for="input-password" class="mb-2">
      <b-form-input
        id="input-password"
        type="password"
        v-model="form.password"
        required
        placeholder="Enter password"
        :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
        data-cy="login-password"
        class="from-input input-password"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>

      <b-form-invalid-feedback
        id="input-password-invalid"
        data-cy="login-password-invalid"
        class="invalid-feedback invalid-feedback-password"
      >
        Please enter your password.
      </b-form-invalid-feedback>
    </b-form-group>

    <template v-if="successMessages || errorMessages">
      <b-row class="mb-2">
        <b-col v-if="successMessages" data-cy="login-success-message" class="text-primary message-col">{{
          successMessages
        }}</b-col>
        <b-col v-if="errorMessages" data-cy="login-error-message" class="text-danger message-col">{{
          errorMessages
        }}</b-col>
      </b-row>
    </template>

    <b-row>
      <b-col>
        <b-button
          data-cy="login-button"
          class="btn-login"
          type="submit"
          variant="primary"
          :disabled="$v.form.$invalid || loading"
        >
          <span class="spinner spinner-white" v-if="loading"></span>
          Login
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';
import router from '@/router';

export default {
  name: 'LoginBox',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  validations: {
    form: {
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
      this.logout({ router, silent: true });
    }
  },
  computed: {
    ...mapGetters('alert', ['errorMessages', 'successMessages']),
    ...mapState('auth', ['loading']),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['login', 'logout']),
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      // Form submit logic
      this.login({ username: this.form.username, password: this.form.password, router });
    }
  }
};
</script>
