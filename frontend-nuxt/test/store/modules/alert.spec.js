import Vue from 'vue'
import { state, actions, getters, mutations } from '@/store/alert'

describe('alert.js', () => {
  let commit
  let result

  describe('state', () => {
    beforeEach(() => {
      result = state()
    })

    it('returns default states', () => {
      expect(result).toStrictEqual({
        type: null,
        position: null,
        title: null,
        text: null
      })
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      commit = jest.fn()
    })
    ;['success', 'info', 'error'].forEach((type) => {
      describe(type, () => {
        beforeEach(() => {
          actions[type](
            { commit },
            {
              showType: 'toast',
              position: 'bottom-end',
              title: 'my title',
              text: 'my text'
            }
          )
        })

        it('triggers commit', () => {
          expect(commit).toHaveBeenCalledWith(type, {
            showType: 'toast',
            position: 'bottom-end',
            title: 'my title',
            text: 'my text'
          })
        })
      })
    })

    describe('setMessage', () => {
      beforeEach(() => {
        actions.setMessage({ commit }, { type: 'toast', message: 'my message' })
      })

      it('triggers commit', () => {
        expect(commit).toHaveBeenCalledWith('setMessage', {
          type: 'toast',
          message: 'my message'
        })
      })
    })

    describe('clear', () => {
      beforeEach(() => {
        actions.clear({ commit })
      })

      it('triggers commit', () => {
        expect(commit).toHaveBeenCalledWith('clear')
      })
    })
  })

  describe('getters', () => {
    describe('errorMessages', () => {
      describe('when type is error', () => {
        beforeEach(() => {
          result = getters.errorMessages({
            type: 'error',
            text: 'my test'
          })
        })

        it('returns expected value', () => {
          expect(result).toBe('my test')
        })
      })

      describe('when type is not a error', () => {
        beforeEach(() => {
          result = getters.errorMessages({
            type: 'info',
            text: 'my test'
          })
        })

        it('returns expected value', () => {
          expect(result).toBe('')
        })
      })
    })
    describe('successMessages', () => {
      describe('when type is success', () => {
        beforeEach(() => {
          result = getters.successMessages({
            type: 'success',
            text: 'my test'
          })
        })

        it('returns expected value', () => {
          expect(result).toBe('my test')
        })
      })

      describe('when type is not a success', () => {
        beforeEach(() => {
          result = getters.successMessages({
            type: 'info',
            text: 'my test'
          })
        })

        it('returns expected value', () => {
          expect(result).toBe('')
        })
      })
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      Vue.toasted = {
        show: jest.fn()
      }
    })
    ;['success', 'info', 'error'].forEach((type) => {
      describe(type, () => {
        describe('non toast', () => {
          beforeEach(() => {
            mutations[type](state, {
              showType: 'non-toast',
              position: 'bottom-end',
              title: 'my title',
              text: 'my text'
            })
          })

          it('sets state', () => {
            expect(state.type).toBe(type)
            expect(state.position).toBe('bottom-end')
            expect(state.title).toBe('my title')
            expect(state.text).toBe('my text')
          })

          it('does not trigger Vue.toasted.show', () => {
            expect(Vue.toasted.show).not.toHaveBeenCalled()
          })
        })
      })

      describe('toast', () => {
        beforeEach(() => {
          mutations[type](state, {
            showType: 'toast',
            position: 'bottom-end',
            title: 'my title',
            text: 'my text'
          })
        })

        it('triggers Vue.toasted.show', () => {
          expect(Vue.toasted.show).toHaveBeenCalledWith(
            '<span class="text">my text</span>',
            {
              duration: 3000,
              keepOnHover: true,
              position: 'bottom-end',
              type
            }
          )
        })
      })
    })

    describe('clear', () => {
      beforeEach(() => {
        mutations.clear(state)
      })

      it('sets state', () => {
        expect(state.type).toBeNull()
        expect(state.position).toBeNull()
        expect(state.title).toBeNull()
        expect(state.text).toBeNull()
      })
    })

    describe('setMessage', () => {
      beforeEach(() => {
        mutations.setMessage(state, {
          type: 'error',
          message: 'my message'
        })
      })

      it('sets state', () => {
        expect(state.type).toBe('error')
        expect(state.text).toBe('my message')
      })
    })
  })
})
