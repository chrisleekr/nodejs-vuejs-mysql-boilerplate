import { shallowMount } from '@vue/test-utils';
import FooterBar from '@/components/FooterBar.vue';

describe('FooterBar.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FooterBar);
  });

  it('renders footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy();
  });
});
