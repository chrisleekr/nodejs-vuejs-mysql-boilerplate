<template>
  <div class="page-class page-logout">
    <h1>Logging out...</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import router from '@/router';

export default {
  name: 'Logout',
  mounted() {
    this.logout({ router });
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
};
</script>
