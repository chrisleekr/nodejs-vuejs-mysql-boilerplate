<template>
  <b-form @submit.stop.prevent="onSubmit">
    <b-form-group id="group-email" label label-for="input-email" description>
      <b-form-input
        id="input-email"
        v-model="form.email"
        type="text"
        required
        placeholder="Enter email"
        :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>

      <b-form-invalid-feedback id="input-email-invalid">Please enter your email address.</b-form-invalid-feedback>
    </b-form-group>

    <template v-if="successMessages || errorMessages">
      <b-row class="mb-2">
        <b-col v-if="successMessages" class="text-primary message-col">{{ successMessages }}</b-col>
        <b-col v-if="errorMessages" class="text-danger message-col">{{ errorMessages }}</b-col>
      </b-row>
    </template>

    <b-row>
      <b-col>
        <b-button type="submit" variant="primary" :disabled="$v.form.$invalid || loading">
          <span class="spinner spinner-white" v-if="loading"></span>
          Request new password
        </b-button>
      </b-col>
      <b-col class="text-right">
        <b-link :to="{ path: '/login' }">Back to login</b-link>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { email, required } from 'vuelidate/lib/validators';
import router from '@/router';

export default {
  name: 'FindPasswordBox',
  data() {
    return {
      form: {
        email: ''
      }
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
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
    ...mapGetters('alert', ['errorMessages', 'successMessages']),
    ...mapState('auth', ['loading']),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['passwordResetRequest', 'logout']),
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      // Form submit logic
      this.passwordResetRequest({ email: this.form.email, router });
    }
  }
};
</script>
