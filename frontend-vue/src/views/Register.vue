<template>
  <b-container class="page-login my-5">
    <b-row>
      <b-col class="text-center">
        <img src="../assets/images/bootstrap-vue.png" width="100" alt="Logo" />
      </b-col>
    </b-row>

    <b-card-group deck class="mt-3">
      <b-card v-if="!isRegistered">
        <h1>Register</h1>
        <p class="text-muted">Register your account</p>
        <register-box />
      </b-card>
      <b-card v-if="isRegistered">
        <h1>You are successfully registered.</h1>
        <br />
        <p class="lead">
          Thank you for registering.
          <br />
          To confirm your email address, please check your email and click the link we sent.
          <br />If you cannot check in the inbox, then make sure you check your spam folder as well.
        </p>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import RegisterBox from '@/components/RegisterBox.vue';

export default {
  name: 'Register',
  components: { RegisterBox },
  metaInfo: {
    title: 'Register',
    meta: [
      {
        name: 'description',
        content: 'Register your account.'
      }
    ]
  },
  computed: {
    ...mapState('auth', ['isRegistered'])
  }
};
</script>
