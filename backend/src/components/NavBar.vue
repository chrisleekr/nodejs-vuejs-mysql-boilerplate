<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">
      <b-navbar-brand :to="{ path: '/' }">
        <img src="../assets/images/bootstrap-vue.png" width="25" />
        Company
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ path: '/' }">
            <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="mr-1" />Dashboard
          </b-nav-item>
          <b-nav-item :to="{ path: '/todo' }">
            <font-awesome-icon :icon="['fas', 'list-alt']" class="mr-1" />Todo
          </b-nav-item>
          <b-nav-item :to="{ path: '/user' }" v-if="showNavigation('manageUser')">
            <font-awesome-icon :icon="['fas', 'portrait']" class="mr-1" />Users
          </b-nav-item>
          <b-nav-item :to="{ path: '/staff' }" v-if="showNavigation('manageStaff')">
            <font-awesome-icon :icon="['fas', 'user']" class="mr-1" />Staffs
          </b-nav-item>
          <b-nav-item-dropdown right v-if="showNavigation('manageSetting')">
            <template v-slot:button-content>
              <font-awesome-icon :icon="['fas', 'cog']" class="mr-1" />Settings
            </template>
            <b-dropdown-item :to="{ path: '/setting' }" v-if="showNavigation('manageSetting')">
              General Settings
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="user">Welcome, {{ user.first_name }}</b-nav-item>

          <b-nav-item :to="{ path: '/logout' }" link-classes="btn btn-grey mx-1">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-1" />Logout
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import User from '../model/user';

export default {
  name: 'NavBar',
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    showNavigation(permissionKey) {
      if (this.user.role === User.userRole.administrator) {
        return true;
      }
      return _.includes(this.user.permission_keys, permissionKey);
    }
  }
};
</script>
