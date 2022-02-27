<template>
  <b-container class="page-login my-5">
    <b-row>
      <b-col class="text-center">
        <img src="../assets/images/bootstrap-vue.png" width="100" alt="Logo" />
      </b-col>
    </b-row>

    <b-card-group deck class="mt-3">
      <b-card v-if="!isPasswordResetRequested">
        <h1>Find my password</h1>
        <p class="text-muted">To reset your password, enter your email address.</p>
        <find-password-box />
      </b-card>
      <b-card v-if="isPasswordResetRequested">
        <h1>We sent you an email.</h1>
        <br />
        <p class="lead">
          Your password reset link is sent.
          <br />To reset your password, please check your email and click the link to reset. <br />If you cannot check
          in the inbox, then make sure you check your spam folder as well.
        </p>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import FindPasswordBox from '@/components/FindPasswordBox.vue';

export default {
  name: 'FindPassword',
  components: { FindPasswordBox },
  metaInfo: {
    title: 'Find Password',
    meta: [
      {
        name: 'description',
        content: 'To reset your password, enter your email address.'
      }
    ]
  },
  mounted() {
    this.$store.commit('auth/clear');
  },
  computed: {
    ...mapState('auth', ['isPasswordResetRequested'])
  },
  methods: {}
};
</script>
