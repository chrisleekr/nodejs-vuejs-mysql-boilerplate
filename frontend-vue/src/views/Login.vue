<template>
  <b-container class="page-login my-5">
    <b-row>
      <b-col class="text-center">
        <img src="../assets/images/bootstrap-vue.png" width="100" alt="Logo" />
      </b-col>
    </b-row>

    <b-card-group deck class="mt-3">
      <b-card>
        <h1>Login</h1>
        <p class="text-muted">Sign in to your account</p>
        <login-box />
      </b-card>

      <b-card class="text-white bg-primary">
        <b-card-text>
          <h2>Sign up</h2>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <b-link :to="{ path: '/register' }" class="btn btn-primary active mt-1">Register Now!</b-link>
        </b-card-text>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';
import LoginBox from '@/components/LoginBox.vue';

export default {
  name: 'Login',
  components: { LoginBox },
  metaInfo: {
    title: 'Login',
    meta: [
      {
        name: 'description',
        content: 'Login with your account.'
      }
    ]
  },
  mounted() {
    if (this.$route.query.messageKey) {
      this.handleAuthMessageKey({ messageKey: this.$route.query.messageKey });
    }
  },
  methods: {
    ...mapActions('auth', ['handleAuthMessageKey'])
  }
};
</script>
