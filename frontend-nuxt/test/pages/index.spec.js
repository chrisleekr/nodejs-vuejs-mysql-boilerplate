import { createLocalVue, shallowMount } from '@vue/test-utils'

import { BootstrapVue } from 'bootstrap-vue'

import index from '@/pages/index.vue'

// create an extended `Vue` constructor
const localVue = createLocalVue()

localVue.use(BootstrapVue)

describe('index.vue', () => {
  let wrapper
  describe('renders', () => {
    beforeEach(() => {
      wrapper = shallowMount(index, {
        localVue
      })
    })

    it('renders', () => {
      expect(wrapper.find('.page-home').exists()).toBeTruthy()
    })
  })

  describe('head', () => {
    let result
    beforeEach(() => {
      wrapper = shallowMount(index, {
        localVue
      })

      result = wrapper.vm.$options.head()
    })

    it('returns expected head', () => {
      expect(result).toStrictEqual({
        title: 'Homepage',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Home page description'
          }
        ]
      })
    })
  })
})
