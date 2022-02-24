<template>
  <div class="page-class page-login">
    <b-container class="my-5">
      <b-row align-v="center" align-h="center" align-content="center">
        <b-col class="text-center" sm="10" md="8" lg="5">
          <img src="../assets/images/bootstrap-vue.png" width="100" alt="Logo" />

          <b-card-group deck class="mt-3">
            <b-card>
              <h1>Backend</h1>
              <p class="text-muted">Sign in to your account</p>
              <login-box />
            </b-card>
          </b-card-group>
          <br />
          &copy; {{ thisYear }}
        </b-col>
      </b-row>
    </b-container>
  </div>
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
        content: 'Login backend with your account.'
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
  },
  computed: {
    thisYear() {
      return new Date().getFullYear();
    }
  }
};
</script>
