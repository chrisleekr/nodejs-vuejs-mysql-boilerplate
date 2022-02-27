<template>
  <div>
    <b-navbar toggleable="md" type="light" variant="light" fixed="top">
      <b-navbar-brand :to="{ path: '/' }">
        <img src="../assets/images/bootstrap-vue.png" width="25" alt="Logo" />
        Company name
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ path: '/' }" data-cy="nav-bar-home">Home</b-nav-item>
          <b-nav-item :to="{ path: '/todo' }" data-cy="nav-bar-todo">Todo</b-nav-item>
          <b-nav-item :to="{ path: '/another-page' }" data-cy="nav-bar-another-page">Another Page</b-nav-item>
          <b-nav-item-dropdown data-cy="nav-bar-sample-page" text="Sample Page" right>
            <b-dropdown-item :to="{ path: '/sample-page/1' }" data-cy="nav-bar-sample-page-1">Page 1</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/sample-page/2' }" data-cy="nav-bar-sample-page-2">Page 2</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->

        <b-navbar-nav class="ml-auto" v-if="isLoggedIn() === false">
          <b-nav-item :to="{ path: '/login' }" data-cy="nav-bar-login" link-classes="btn btn-info text-light mx-1"
            >Login</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/register' }"
            data-cy="nav-bar-register"
            link-classes="btn btn-primary mx-1 text-light"
            >Sign up</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-if="isLoggedIn() === true">
          <b-nav-item
            v-if="user"
            :to="{ path: '/account' }"
            data-cy="nav-bar-welcome-text"
            link-classes="btn btn-link mx-1"
            >Welcome, {{ user.first_name }}</b-nav-item
          >
          <b-nav-item :to="{ path: '/account' }" data-cy="nav-bar-account" link-classes="btn btn-info text-light mx-1"
            >My Account</b-nav-item
          >
          <b-nav-item :to="{ path: '/logout' }" data-cy="nav-bar-logout" link-classes="btn btn-grey  mx-1 text-dark"
            >Logout</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'NavBar',
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isLoggedIn'])
  }
};
</script>
