import { createLocalVue, shallowMount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';

import Home from '@/views/Home.vue';

// create an extended `Vue` constructor
const localVue = createLocalVue();

localVue.use(BootstrapVue);

describe('Home.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Home, {
      localVue
    });
  });

  it('renders', () => {
    expect(wrapper.find('.page-home').exists()).toBeTruthy();
  });
});
