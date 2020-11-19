<template>
  <b-container class="page-login my-5">
    <b-row>
      <b-col class="text-center">
        <img src="~/static/icon.png" width="100" />
      </b-col>
    </b-row>

    <b-card-group deck class="mt-3">
      <b-card v-if="!isPasswordResetRequested">
        <h1>Find my password</h1>
        <p class="text-muted">
          To reset your password, enter your email address.
        </p>
        <find-password-box />
      </b-card>
      <b-card v-if="isPasswordResetRequested">
        <h1>We sent you an email.</h1>
        <br />
        <p class="lead">
          Your password reset link is sent.
          <br />To reset your password, please check your email and click the
          link to reset. <br />If you cannot check in the inbox, then make sure
          you check your spam folder as well.
        </p>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import FindPasswordBox from '@/components/FindPasswordBox.vue'

export default {
  name: 'FindPassword',
  components: { FindPasswordBox },
  middleware: ['guest-only'],
  head() {
    return {
      title: 'Find my password',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'To reset your password, enter your email address.'
        }
      ]
    }
  },
  computed: {
    ...mapState('auth', ['isPasswordResetRequested'])
  },
  mounted() {
    this.$store.commit('alert/clear')
  }
}
</script>
