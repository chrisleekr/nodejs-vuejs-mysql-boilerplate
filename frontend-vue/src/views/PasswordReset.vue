<template>
  <b-container class="page-login my-5">
    <b-row>
      <b-col class="text-center">
        <img src="../assets/images/bootstrap-vue.png" width="100" alt="Logo" />
      </b-col>
    </b-row>

    <b-card-group deck class="mt-3">
      <b-card v-if="!isPasswordResetted">
        <h1>Reset your password</h1>
        <p class="text-muted">Please enter new password.</p>
        <password-reset-box :auth-key="authKey" />
      </b-card>
      <b-card v-if="isPasswordResetted">
        <h1>Your password has been updated.</h1>
        <br />
        <p class="lead">
          You can now use your new password to login.
          <br />
          <br />
          <b-link class="btn btn-link p-0" :to="{ path: '/login' }">Login now</b-link>
        </p>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions, mapGetters } from 'vuex';
import PasswordResetBox from '@/components/PasswordResetBox.vue';

export default {
  name: 'PasswordReset',
  components: { PasswordResetBox },
  metaInfo: {
    title: 'Reset Password',
    meta: [
      {
        name: 'description',
        content: 'Reset your password.'
      }
    ]
  },
  data() {
    return {
      authKey: ''
    };
  },
  mounted() {
    this.$store.commit('auth/clear');

    if (_.isEmpty(this.$route.query.key) || _.isEmpty(this.$route.query.messageKey)) {
      // error
      this.error({
        showType: 'toast',
        position: 'bottom-end',
        title: 'Error',
        text: 'This is not valid access. Please try again.'
      });
      this.$router.push('/login');
    } else {
      // all good
      this.authKey = this.$route.query.key;
      this.handleAuthMessageKey({ messageKey: this.$route.query.messageKey });
    }
  },
  computed: {
    ...mapState('auth', ['isPasswordResetted']),
    ...mapGetters('alert', ['errorMessages'])
  },
  methods: {
    ...mapActions('auth', ['handleAuthMessageKey']),
    ...mapActions('alert', ['error'])
  }
};
</script>
