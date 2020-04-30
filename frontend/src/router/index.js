import store from '@/store';

import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL || '/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
    },
    {
      path: '/find-password',
      name: 'find-password',
      component: () => import(/* webpackChunkName: "find-password" */ '../views/FindPassword.vue')
    },
    {
      path: '/password-reset',
      name: 'password-reset',
      component: () => import(/* webpackChunkName: "password-reset" */ '../views/PasswordReset.vue')
    },
    {
      path: '/another-page',
      name: 'another-page',
      component: () => import(/* webpackChunkName: "page" */ '../views/Page/Page.vue'),
      meta: {
        pageName: 'another page'
      }
    },
    {
      path: '/sample-page/:pageId',
      name: 'sample-page',
      component: () => import(/* webpackChunkName: "page" */ '../views/Page/Page.vue'),
      meta: {
        pageName: 'sample page'
      }
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import(/* webpackChunkName: "todo" */ '../views/Todo/Todo.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ '../views/Account/Account.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account/update',
      name: 'account-update',
      component: () => import(/* webpackChunkName: "account-update" */ '../views/Account/AccountUpdate.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/Logout.vue')
    }
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isLoggedIn']()) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
