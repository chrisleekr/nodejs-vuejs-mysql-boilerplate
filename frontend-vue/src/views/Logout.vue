<template>
  <div class="page-logout">
    <h1>Logging out...</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Logout',
  mounted() {
    this.logout({ router: this.$router });
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
};
</script>
