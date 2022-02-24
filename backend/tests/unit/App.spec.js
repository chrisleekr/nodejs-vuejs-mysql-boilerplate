import { createLocalVue, shallowMount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';
import App from '@/App.vue';

// create an extended `Vue` constructor
const localVue = createLocalVue();

localVue.use(BootstrapVue);

const SimpleLayoutStub = {
  name: 'simple-layout',
  template: '<div class="simple-layout"><slot></slot></div>',
  props: []
};

const RouterViewStub = {
  name: 'router-view',
  template: '<div class="router-view"><slot></slot></div>',
  props: []
};

describe('App.vue', () => {
  let wrapper;
  beforeEach(() => {
    const $route = {
      path: '/login',
      name: 'login',
      component: () => import('../../src/views/Login.vue'),
      meta: {
        layout: 'simple-layout'
      }
    };
    wrapper = shallowMount(App, {
      localVue,
      mocks: {
        $route
      },
      stubs: {
        RouterView: RouterViewStub,
        SimpleLayout: SimpleLayoutStub
      }
    });
  });

  it('renders router-view component', () => {
    expect(wrapper.findComponent(RouterViewStub).exists()).toBeTruthy();
  });
});
