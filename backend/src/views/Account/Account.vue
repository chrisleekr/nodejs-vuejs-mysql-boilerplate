<template>
  <div class="page-class page-account">
    <b-container>
      <h1 class="page-title">My account</h1>
      <b-card-group deck>
        <b-card>
          <template v-slot:header>
            <strong>Your information</strong>
          </template>

          <div v-if="loading">
            <span class="spinner"></span>
          </div>
          <div v-if="!loading && user">
            <b-form-group :description="user.username" label="Username"></b-form-group>
            <b-form-group :description="user.full_name" label="Name"></b-form-group>
            <b-form-group :description="user.email" label="Email"></b-form-group>
            <b-form-group
              :description="`${user.last_login_at_formatted} (${user.last_login_ip})`"
              label="Last login at"
            ></b-form-group>
          </div>
          <template v-if="!loading && user" v-slot:footer>
            <b-link :to="{ path: '/account/update' }" class="btn btn-primary">Update information</b-link>
          </template>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import router from '@/router';

export default {
  name: 'Account',
  metaInfo() {
    return {
      title: 'My account',
      meta: []
    };
  },
  mounted() {
    this.me({ router });
  },
  computed: {
    ...mapState('user', ['loading', 'user'])
  },
  methods: {
    ...mapActions('user', ['me'])
  }
};
</script>
