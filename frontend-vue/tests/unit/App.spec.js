import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import App from '@/App.vue';
import ConfigService from '@/services/configService';

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

const NavBarStub = {
  name: 'nav-bar',
  template: '<div class="nav-bar"><slot></slot></div>',
  props: []
};

const FooterBarStub = {
  name: 'footer-bar',
  template: '<div class="footer-bar"><slot></slot></div>',
  props: []
};

const RouterViewStub = {
  name: 'router-view',
  template: '<div class="router-view"><slot></slot></div>',
  props: []
};

describe('App.vue', () => {
  let wrapper;
  beforeAll(() => {
    ConfigService.loadConfig = jest.fn();

    wrapper = shallowMount(App, {
      localVue,
      stubs: {
        NavBar: NavBarStub,
        FooterBar: FooterBarStub,
        RouterView: RouterViewStub
      }
    });
  });

  it('triggers ConfigService.loadConfig', () => {
    expect(ConfigService.loadConfig).toHaveBeenCalled();
  });

  it('renders nav bar component', () => {
    expect(wrapper.getComponent(NavBarStub).exists()).toBeTruthy();
  });

  it('renders footer bar component', () => {
    expect(wrapper.getComponent(FooterBarStub).exists()).toBeTruthy();
  });

  it('renders router-view component', () => {
    expect(wrapper.getComponent(RouterViewStub).exists()).toBeTruthy();
  });
});
