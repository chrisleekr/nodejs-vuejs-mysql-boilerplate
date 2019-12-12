import { shallowMount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import Vuelidate from 'vuelidate';
import LoginBox from '@/components/LoginBox.vue';

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(Vuex);
localVue.use(Vuelidate);

describe('LoginBox.vue', () => {
  let wrapper;

  let store;
  let alertModule;
  let authModule;

  beforeEach(() => {
    alertModule = {
      namespaced: true,
      getters: {
        errorMessages: () => '',
        successMessages: () => ''
      }
    };

    authModule = {
      namespaced: true,
      getters: {
        isLoggedIn: () => false
      },
      state: {
        loading: false
      },
      actions: {
        login: jest.fn(),
        logout: jest.fn()
      }
    };

    store = new Vuex.Store({
      modules: {
        alert: alertModule,
        auth: authModule
      }
    });
  });

  describe('render', () => {
    beforeEach(() => {
      wrapper = shallowMount(LoginBox, { store, localVue });
    });

    it('renders login box', () => {
      expect(wrapper.find('.login-box').exists()).toBeTruthy();
    });
  });

  describe('if isLoggedIn is true', () => {
    beforeEach(() => {
      authModule.getters.isLoggedIn = () => true;

      store = new Vuex.Store({
        modules: {
          alert: alertModule,
          auth: authModule
        }
      });

      wrapper = shallowMount(LoginBox, { store, localVue });
    });

    it('trigger logout', () => {
      expect(authModule.actions.logout).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          alert: alertModule,
          auth: authModule
        }
      });

      wrapper = shallowMount(LoginBox, { store, localVue });
    });

    describe('when form is not filled', () => {
      beforeEach(() => {
        wrapper.setData({ form: { username: '', password: '' } });

        wrapper.vm.onSubmit();
      });

      it('does not trigger login', () => {
        expect(authModule.actions.login).not.toHaveBeenCalled();
      });
    });

    describe('when form is filled with invalid value', () => {
      beforeEach(() => {
        wrapper.setData({ form: { username: 'invalid-value', password: 'short' } });

        wrapper.vm.onSubmit();
      });

      it('does not trigger login', () => {
        expect(authModule.actions.login).not.toHaveBeenCalled();
      });
    });

    describe('when form is filled with valid value', () => {
      beforeEach(() => {
        wrapper.setData({ form: { username: 'user@boilerplate.local', password: '123456' } });

        wrapper.vm.onSubmit();
      });

      it('triggers login', () => {
        expect(authModule.actions.login).toHaveBeenCalled();
      });
    });
  });
});
