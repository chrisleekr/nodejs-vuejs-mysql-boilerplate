import Vue from 'vue';
import alert from '@/store/modules/alert';

describe('alert.js', () => {
  let commit;
  const state = {
    type: null,
    position: null,
    title: null,
    text: null
  };
  let result;
  describe('actions', () => {
    beforeEach(() => {
      commit = jest.fn();
    });

    ['success', 'info', 'error'].forEach(type => {
      describe(type, () => {
        beforeEach(() => {
          alert.actions[type](
            { commit },
            { showType: 'toast', position: 'bottom-end', title: 'my title', text: 'my text' }
          );
        });

        it('triggers commit', () => {
          expect(commit).toHaveBeenCalledWith(type, {
            showType: 'toast',
            position: 'bottom-end',
            title: 'my title',
            text: 'my text'
          });
        });
      });
    });

    describe('setMessage', () => {
      beforeEach(() => {
        alert.actions.setMessage({ commit }, { type: 'toast', message: 'my message' });
      });

      it('triggers commit', () => {
        expect(commit).toHaveBeenCalledWith('setMessage', { type: 'toast', message: 'my message' });
      });
    });

    describe('clear', () => {
      beforeEach(() => {
        alert.actions.clear({ commit });
      });

      it('triggers commit', () => {
        expect(commit).toHaveBeenCalledWith('clear');
      });
    });
  });

  describe('getters', () => {
    describe('errorMessages', () => {
      describe('when type is error', () => {
        beforeEach(() => {
          result = alert.getters.errorMessages({ type: 'error', text: 'my test' });
        });

        it('returns expected value', () => {
          expect(result).toBe('my test');
        });
      });

      describe('when type is not a error', () => {
        beforeEach(() => {
          result = alert.getters.errorMessages({ type: 'info', text: 'my test' });
        });

        it('returns expected value', () => {
          expect(result).toBe('');
        });
      });
    });
    describe('successMessages', () => {
      describe('when type is success', () => {
        beforeEach(() => {
          result = alert.getters.successMessages({ type: 'success', text: 'my test' });
        });

        it('returns expected value', () => {
          expect(result).toBe('my test');
        });
      });

      describe('when type is not a success', () => {
        beforeEach(() => {
          result = alert.getters.successMessages({ type: 'info', text: 'my test' });
        });

        it('returns expected value', () => {
          expect(result).toBe('');
        });
      });
    });
  });

  describe('mutations', () => {
    beforeEach(() => {
      Vue.swal = jest.fn();
    });

    ['success', 'info', 'error'].forEach(type => {
      describe(type, () => {
        describe('non toast', () => {
          beforeEach(() => {
            alert.mutations[type](state, {
              showType: 'non-toast',
              position: 'bottom-end',
              title: 'my title',
              text: 'my text'
            });
          });

          it('sets state', () => {
            expect(state.type).toBe(type);
            expect(state.position).toBe('bottom-end');
            expect(state.title).toBe('my title');
            expect(state.text).toBe('my text');
          });

          it('does not trigger Vue.swal', () => {
            expect(Vue.swal).not.toHaveBeenCalled();
          });
        });
      });

      describe('toast', () => {
        beforeEach(() => {
          alert.mutations[type](state, {
            showType: 'toast',
            position: 'bottom-end',
            title: 'my title',
            text: 'my text'
          });
        });

        it('triggers Vue.swal', () => {
          expect(Vue.swal).toHaveBeenCalledWith({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 10000,
            type,
            title: 'my title',
            text: 'my text'
          });
        });
      });
    });

    describe('clear', () => {
      beforeEach(() => {
        alert.mutations.clear(state);
      });

      it('sets state', () => {
        expect(state.type).toBeNull();
        expect(state.position).toBeNull();
        expect(state.title).toBeNull();
        expect(state.text).toBeNull();
      });
    });

    describe('setMessage', () => {
      beforeEach(() => {
        alert.mutations.setMessage(state, { type: 'error', message: 'my message' });
      });

      it('sets state', () => {
        expect(state.type).toBe('error');
        expect(state.text).toBe('my message');
      });
    });
  });
});
