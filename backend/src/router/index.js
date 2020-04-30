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
      name: 'dashboard',
      component: Home,
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
      meta: {
        layout: 'simple-layout'
      }
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import(/* webpackChunkName: "todo" */ '../views/Todo/Todo.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },

    {
      path: '/logout',
      name: 'logout',
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/Logout.vue'),
      meta: {
        layout: 'simple-layout'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ '../views/User/UserList.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/user/new',
      name: 'user-new',
      component: () => import(/* webpackChunkName: "user" */ '../views/User/UserForm.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/user/:id',
      name: 'user-edit',
      component: () => import(/* webpackChunkName: "user" */ '../views/User/UserForm.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/staff',
      name: 'staff',
      component: () => import(/* webpackChunkName: "staff" */ '../views/Staff/StaffList.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/staff/new',
      name: 'staff-new',
      component: () => import(/* webpackChunkName: "staff" */ '../views/Staff/StaffForm.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/staff/:id',
      name: 'staff-edit',
      component: () => import(/* webpackChunkName: "staff" */ '../views/Staff/StaffForm.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import(/* webpackChunkName: "setting" */ '../views/Setting/SettingList.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/setting/new',
      name: 'setting-new',
      component: () => import(/* webpackChunkName: "setting" */ '../views/Setting/SettingForm.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
    },
    {
      path: '/setting/:id',
      name: 'setting-edit',
      component: () => import(/* webpackChunkName: "setting" */ '../views/Setting/SettingForm.vue'),
      meta: {
        layout: 'backend-layout',
        requiresAuth: true
      }
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
